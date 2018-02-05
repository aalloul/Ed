'use strict';

const DEBUG = {
  rowDisjointLines: true,
  rowsBetweenDisjointLines: true,
  columnsBetweenDisjointLines: true,
};

const DOCUMENT_WIDTH_POINTS = 1200;
const DOCUMENT_HEIGHT_POINTS = 1600;
const EMAIL_WIDTH_PIXELS = 600;

//const mainTableMarginPoints = Math.min(minX, DOCUMENT_WIDTH_POINTS - maxX);

const coordToPercents = (coord, totalWidth = DOCUMENT_WIDTH_POINTS) => coord / totalWidth * 100;
const coordToPixels = (coord, totalWidth = DOCUMENT_WIDTH_POINTS) => coord / totalWidth * EMAIL_WIDTH_PIXELS;

const DISJOINT_LINES = {
  HORIZONTAL: 'horizontal',
  VERTICAL: 'vertical'
};

// couple of functional utils
const createCoordsGetter = (...coords) => point => coords.map(coord => point[coord]);
const notIntersecting = (coord, [start, stop]) => coord <= start || coord >= stop;

/**
 * Find the disjoint lines - lines that touch some edges of points from "points"
 * but don't intersect
 *
 * @param {Array} points The points of points
 * @param {String} type The result should be horizontal lines
 */
function getDisjointLines(points, type = DISJOINT_LINES.VERTICAL) {
  const result = new Set();
  const coordsGetter = type === DISJOINT_LINES.VERTICAL
    ? createCoordsGetter('from_x', 'to_x')
    : createCoordsGetter('from_y', 'to_y');
  points.forEach(point => coordsGetter(point).forEach(result.add.bind(result)));

  const disjointLines = [...result]
    .filter(coord => points.every(point => notIntersecting(coord, coordsGetter(point))))
    .sort((a, b) => Number(a) - Number(b));

  if (DEBUG.rowDisjointLines) {
    console.log(`"${type}" disjoint lines for points`, { points, disjointLines });
  }

  return disjointLines;
}

function getSubsetBetweenLines(points, start, stop, type = DISJOINT_LINES.VERTICAL) {
  return type === DISJOINT_LINES.VERTICAL
    ? points.filter(({ from_x, to_x }) => from_x >= start && to_x <= stop)
    : points.filter(({ from_y, to_y }) => from_y >= start && to_y <= stop);
}

/**
 * Group points by disjoint lines
 * @param {Array} points
 * @param {Array} disjointLines
 * @param {String} type
 * @return {Array}
 */
function groupPoints(points, disjointLines, type = DISJOINT_LINES.VERTICAL) {
  const groups = [];
  for (let i = 0; i < disjointLines.length - 1; i++) {
    groups[i] = getSubsetBetweenLines(points, disjointLines[i], disjointLines[i + 1], type);
  }

  if (
    type === DISJOINT_LINES.HORIZONTAL && DEBUG.rowsBetweenDisjointLines
    || type === DISJOINT_LINES.VERTICAL && DEBUG.columnsBetweenDisjointLines
  ) {
    console.log(`result groups for "${type}" disjointLines`, { disjointLines, groups });
  }

  return groups;
}

function groupPointsByRows(rows) {
  const columns = [];
  for (let i = 0; i < rows.length; i++) {
    const disjointLines = getDisjointLines(rows[i], DISJOINT_LINES.VERTICAL);
    if (!disjointLines.length) {
      columns[i] = [];

      continue;
    }

    columns[i] = groupPoints(rows[i], disjointLines, DISJOINT_LINES.VERTICAL);
  }

  return columns;
}

// todo:pavlik build points recursively unless all points are processed

const getWordFromPoint = ({ word = '' }) => word.replace(/([^>])\n/g, '$1<br/>');
const getWidth = (start, stop) => Math.abs(stop - start);
const getBoxWidth = ({ from_x, to_x }) => getWidth(from_x, to_x);

// safe implementation for double numbers
const isEqual = (a, b, EPSILON = 0.001) => Math.abs(Number(a) - Number(b)) <= EPSILON;

// build HTML table from result columns
function buildTableColumn({ width, blocks }, totalWidth, totalHeight, isInternalTable) {
  function renderBlocks() {
    return `
      <td valign="top" width="${coordToPercents(width, totalWidth)}%">
          ${blocks.map(getWordFromPoint).filter(Boolean).join('<br>')}
      </td>
    `;
  }

  function renderInternalTable() {
    const internalTableData = {
      points: blocks,
      width: totalWidth,
      height: totalHeight,
      isInternalTable: true,
    };

    return `
      <td>
        ${build(internalTableData)}
      </td>
    `;
  }

  return !isInternalTable && blocks.length > 1
    ? renderInternalTable()
    : renderBlocks();
}

function buildTableRow(groupedColumn, totalWidth, totalHeight, isInternalTable) {
  // to preserve formatting add gap columns
  let left = 0;
  const spacedColumns = [];
  groupedColumn.forEach(columnBlocks => {
    if (!columnBlocks.length) {
      return;
    }

    const shouldAddFirstSpacedColumn = !isEqual(columnBlocks[0].from_x, left) && !isInternalTable;

    if (shouldAddFirstSpacedColumn) {
      spacedColumns.push({
        width: getWidth(columnBlocks[0].from_x, left),
        blocks: [],
      });

      left = columnBlocks[0].from_x;
    }

    const width = Math.max(...columnBlocks.map(getBoxWidth));
    spacedColumns.push({
      width,
      blocks: columnBlocks,
    });

    left += width;
  });

  const lastColumnBlocks = groupedColumn[groupedColumn.length - 1] || [];

  const shouldAddLastSpacedColumn = lastColumnBlocks.length
    && !isEqual(lastColumnBlocks[0].to_x, totalWidth)
    && !isInternalTable;

  if (shouldAddLastSpacedColumn) {
    spacedColumns.push({
      width: getWidth(totalWidth, lastColumnBlocks[0].to_x),
      blocks: [],
    });
  }

  // console.log({ spacedColumns });

  return `
    <tr>
      <td valign="top">
        <table width="100%" cellspacing="0" cellpadding="0" border="0">
          <tr>
            ${spacedColumns.map(
              columnDescriptor => buildTableColumn(columnDescriptor, totalWidth, totalHeight, isInternalTable)
            ).join('')}
          </tr>
        </table>
      </td>
    </tr>
  `;
}

function buildTable(groupedColumns, totalWidth, totalHeight, isInternalTable) {
  return `
    <table width="100%" cellspacing="0" cellpadding="0" border="0">
      ${groupedColumns.map(
          groupedColumn => buildTableRow(groupedColumn, totalWidth, totalHeight, isInternalTable)
        ).join('')
      }
    </table>
  `;
}

// console.log('overall result', buildTable(columns));

function build({ points, width: totalWidth, height: totalHeight, isInternalTable = false }) {
  const disjointLines = getDisjointLines(points, DISJOINT_LINES.HORIZONTAL);
  const rows = groupPoints(points, disjointLines, DISJOINT_LINES.HORIZONTAL);
  const columns = groupPointsByRows(rows);

  return buildTable(columns, totalWidth, totalHeight, isInternalTable);
}

// For development environment take data from table folder and don't start the server
if ('NODE_ENV' in process.env && process.env.NODE_ENV === 'development') {
  const fs = require('fs');
  const input = require('./4');
  const result = build(input);

  fs.writeFile("./table.html", result, function(err) {
    if (err) {
      return console.error(err);
    }

    console.log('File "table.html" is updated');
  });

  return;
}

const express = require('express');
const app = express();
const bodyParser = require('body-parser');
app.use(bodyParser.json());
app.get('/', (req, res) => {
  res.status(404).send('Not found!');
});

app.post('/', (req, res) => {
  const input = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
  if (!input.points || !Array.isArray(input.points)) {
    res.status(404).send('No "points" or it is not an array');
  }

  if (!input.width || !input.height) {
    res.status(404).send('No "width" or "height" in the input');
  }

  res.status(200).send(build(input));
});

if (module === require.main) {
  const server = app.listen(process.env.PORT || 3030, () => {
    const port = server.address().port;
    console.log(`App listening on port ${port}`);
  });
}

module.exports = app;
