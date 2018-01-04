const fs = require('fs');
const data = require('./tmp');
// const data = [
//   { from_x: 0, to_x: 400, from_y: 0, to_y: 20 },
//   { from_x: 1200, to_x: 1500, from_y: 0, to_y: 140 },
//   { from_x: 0, to_x: 400, from_y: 30, to_y: 90 },
//   { from_x: 0, to_x: 500, from_y: 140, to_y: 180 },
//   { from_x: 0, to_x: 1550, from_y: 210, to_y: 900 },
// ];

const DOCUMENT_WIDTH_POINTS = 1600;
const DOCUMENT_HEIGHT_POINTS = 1200;
const EMAIL_WIDTH_PIXELS = 600;


// console.log(data);

//const mainTableMarginPoints = Math.min(minX, DOCUMENT_WIDTH_POINTS - maxX);

const pointToPixel = point => point / DOCUMENT_WIDTH_POINTS * EMAIL_WIDTH_PIXELS;

// find the disjoint horizontal lines

// такие точки, что все остальные либо from_x > point.x, либо to_x < point.x
function getDisjointLines(set, isHorizontal = false) {
  if (isHorizontal) {
    const ys = new Set();
    set.forEach(({ from_y, to_y }) => {
      ys.add(from_y);
      ys.add(to_y);
    });

    return [...ys].filter(y => set.every(({ from_y, to_y }) => y <= from_y || y >= to_y));
  } else {
    const xs = new Set();
    set.forEach(({ from_x, to_x }) => {
      xs.add(from_x);
      xs.add(to_x);
    });

    return [...xs].filter(x => set.every(({ from_x, to_x }) => x <= from_x || x >= to_x));
  }
}

function getSubsetBetweenLines(set, coord1, coord2, isHorizontal = false) {
  if (isHorizontal) {
    return set.filter(({ from_y, to_y }) => from_y >= coord1 && to_y <= coord2);
  } else {
    return set.filter(({ from_x, to_x }) => from_x >= coord1 && to_x <= coord2);
  }
}

// console.log(x, minX, maxX);

// todo build this recursively unless all points are processed
const disjointLines = getDisjointLines(data, true);
// console.log('disjoint lines', disjointLines);

// group points by rows
const rows = [];
for (let i = 0; i < disjointLines.length - 1; i++) {
  rows[i] = getSubsetBetweenLines(data, disjointLines[i], disjointLines[i + 1], true);
}

// console.log('result rows', rows);

const columns = [];
for (let i = 0; i < rows.length; i++) {
  columns[i] = [];

  const disjointLines = getDisjointLines(rows[i]);
  // console.log(`For row ${i} disjoint lines`, disjointLines);
  if (!disjointLines.length) {
    continue;
  }

  for (let j = 0; j < disjointLines.length - 1; j++) {
    columns[i][j] = getSubsetBetweenLines(rows[i], disjointLines[j], disjointLines[j + 1]);
  }
}

// console.log('result columns', JSON.stringify(columns));

// scale them to the 600px width ???

// build HTML table from result columns
function buildTableCell(cellBlocks) {

  return `<td>${cellBlocks.map(cell => {
    return cell.word && cell.word.replace(/([^>])\n/g, '$1<br/>')
  }).filter(Boolean).join('<br>')}</td>`;

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
      <td>
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


fs.writeFile("./table.html", buildTable(columns), function(err) {
  if (err) {
    return console.error(err);
  }

  console.log('File "table.html" is updated');
});

