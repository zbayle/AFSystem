import React from 'react';
import Barcode from 'react-barcode';
import { jsPDF } from 'jspdf';
import fetchAllProducts from '../../services/fetchAllProducts_api';

class BarcodePdfGenerator extends React.Component {
  generatePdf = async () => {
    const doc = new jsPDF();
    const products = await fetchAllProducts();

    let y = 10; // vertical position of the barcode

    for (const product of products) {
      doc.text(product.name, 10, y);

      const barcodeSvg = document.createElement('div');
      barcodeSvg.innerHTML = <Barcode value={product.upc} />;

      const svgElement = barcodeSvg.firstChild;
      svgElement.setAttribute('xmlns', 'http://www.w3.org/2000/svg');

      doc.addSvg(svgElement.outerHTML, 10, y + 10);

      y += 40; // move to the next position
    }

    doc.save('barcodes.pdf');
  };

  render() {
    return (
      <button onClick={this.generatePdf}>Generate PDF</button>
    );
  }
}

export default BarcodePdfGenerator;