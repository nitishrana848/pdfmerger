const fileSelector = document.getElementById('file1');
  fileSelector.addEventListener('change', (event) => {
    const fileList = event.target.files;
    console.log(fileList);
    mergeAllPDFs(fileList);
  });

async function mergeAllPDFs(fileList) {
    
    const pdfDoc = await PDFLib.PDFDocument.create();
    const numDocs = fileList.length;
    console.log(numDocs)
    for(var i = 0; i < numDocs; i++) {
        const donorPdfBytes = await fetch(fileList[i]).then(res => res.arrayBuffer());
        const donorPdfDoc = await PDFLib.PDFDocument.load(donorPdfBytes);
        const docLength = donorPdfDoc.getPageCount();
        for(var k = 0; k < docLength; k++) {
            const [donorPage] = await pdfDoc.copyPages(donorPdfDoc, [k]);
            //console.log("Doc " + i+ ", page " + k);
            pdfDoc.addPage(donorPage);
        }
    }

    const pdfDataUri = await pdfDoc.saveAsBase64({ dataUri: true });
    //console.log(pdfDataUri);
  
    // strip off the first part to the first comma "data:image/png;base64,iVBORw0K..."
    var data_pdf = pdfDataUri.substring(pdfDataUri.indexOf(',')+1);
}
