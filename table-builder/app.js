'use strict';

const DEBUG = {
  rowDisjointLines: true,
  rowsBetweenDisjointLines: true,
  columnsBetweenDisjointLines: true,
};

const DOCUMENT_WIDTH_POINTS = 1600;
const DOCUMENT_HEIGHT_POINTS = 1200;
const EMAIL_WIDTH_PIXELS = 600;

//const mainTableMarginPoints = Math.min(minX, DOCUMENT_WIDTH_POINTS - maxX);

const pointToPixel = point => point / DOCUMENT_WIDTH_POINTS * EMAIL_WIDTH_PIXELS;

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
    .filter(coord => points.every(point => notIntersecting(coord, coordsGetter(point))));
  if (DEBUG.rowDisjointLines) {
    console.log('row disjoint lines', disjointLines);
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
    console.log('result groups for disjointLines', { disjointLines, groups });
  }

  return groups;
}

function groupPointsByRows(rows) {
  const columns = [];
  for (let i = 0; i < rows.length; i++) {
    const disjointLines = getDisjointLines(rows[i]);
    if (!disjointLines.length) {
      columns[i] = [];

      continue;
    }

    columns[i] = groupPoints(rows[i], disjointLines);
  }

  return columns;
}


// todo:pavlik build points recursively unless all points are processed
// todo:pavlik save empty distances:
/* ****
   ##** -- this start with naive implementation start from the beginning of the string
   ##** -- we need to save empty distances (aka air) to keep them in the right side
   #### */
// todo:pavlik scale them to the 600px width ???

function getWordFromPoint({ word }) {
  return (word || '').replace(/([^>])\n/g, '$1<br/>');
}

// build HTML table from result columns
function buildTableCell(cellBlocks) {

  return `
    <td valign="top">
      ${cellBlocks.map(getWordFromPoint).filter(Boolean).join('<br>')}
    </td>
  `;

  // todo finish it
  return `
    <td>
      ${Array.isArray(cell[0]) && Array.isArray(cell[0][0])
        ? buildTable(cell)
        : cell.word}
    </td>
  `;
}


function buildTableRow(rows) {
  return `
    <tr>
      <td valign="top">
        <table>
          <tr>
            ${rows.map(buildTableCell).join('')}
          </tr>
        </table>
      </td>
    </tr>
  `;
}

function buildTable(points) {
  return `
    <table>
      ${points.map(buildTableRow).join('')}
    </table>
  `;
}

// console.log('overall result', buildTable(columns));

function build(points) {
  const disjointLines = getDisjointLines(points, DISJOINT_LINES.HORIZONTAL);
  const rows = groupPoints(points, disjointLines, DISJOINT_LINES.HORIZONTAL);
  const columns = groupPointsByRows(rows);

  return buildTable(columns);
}

// For development environment take data from table folder and don't start the server
if ('NODE_ENV' in process.env && process.env.NODE_ENV === 'development') {
  const fs = require('fs');
  const points = require('./3');
  const result = build(points);

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
  if (!req.body.points || !Array.isArray(req.body.points)) {
    res.status(404).send('Not found!');
  } else {
    res.status(200).send(build(req.body.points));
  }
});

if (module === require.main) {
  const server = app.listen(process.env.PORT || 8081, () => {
    const port = server.address().port;
    console.log(`App listening on port ${port}`);
  });
}

module.exports = app;
