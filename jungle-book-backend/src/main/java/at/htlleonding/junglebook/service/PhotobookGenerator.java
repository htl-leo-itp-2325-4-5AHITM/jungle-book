package at.htlleonding.junglebook.service;

import at.htlleonding.junglebook.model.Journal;
import com.itextpdf.text.Document;
import com.itextpdf.text.Element;
import com.itextpdf.text.Image;
import com.itextpdf.text.pdf.*;
import com.itextpdf.text.pdf.parser.PdfTextExtractor;
import com.itextpdf.text.pdf.parser.Vector;

import java.io.ByteArrayOutputStream;
import java.io.FileNotFoundException;
import java.io.InputStream;
import java.util.List;

public class PhotobookGenerator {
    public byte[] getPhotobook(List<Journal> journals) throws Exception {
        InputStream templateStream = getClass().getResourceAsStream("/pdf/Photobook design.pdf");
        if (templateStream == null) {
            throw new FileNotFoundException("Template PDF '/pdf/Photobook design.pdf' not found.");
        }
        PdfReader templateReader = new PdfReader(templateStream);
        int templatePageCount = templateReader.getNumberOfPages();

        // The output stream where the final PDF will be written
        ByteArrayOutputStream outputStream = new ByteArrayOutputStream();

        // Create a new Document and PdfCopy to merge pages
        Document document = new Document();
        PdfCopy pdfCopy = new PdfCopy(document, outputStream);
        document.open();

        BaseFont baseFont = BaseFont.createFont(BaseFont.HELVETICA, BaseFont.WINANSI, BaseFont.NOT_EMBEDDED);

        // Iterate over the journals; for each one we will import a page from the template
        for (int i = 0; i < journals.size(); i++) {
            // Cycle through the pages in the template. (For example, if there are 3 pages in the template,
            // journal 1 uses page 1, journal 2 uses page 2, journal 4 uses page 1 again, etc.)
            int templatePageNumber = (i % templatePageCount) + 1;
            PdfImportedPage importedPage = pdfCopy.getImportedPage(templateReader, templatePageNumber);

            // Create a stamp on the page to add extra content (the journal image)
            PdfCopy.PageStamp pageStamp = pdfCopy.createPageStamp(importedPage);

            // Construct the marker string (e.g. "§1%1" for the first page).
            // In a more advanced implementation you could parse the page content to locate this marker.
            String marker = "§" + (i + 1) + "%" + (i + 1);
            // For this example we assume the image should be placed at fixed coordinates.
            // You could determine x, y based on the marker position if needed.
            float headerX = 300f;
            float headerY = 730f;
            float imageX = 125f;
            float imageY = 300f;

            PdfContentByte overContent = pageStamp.getOverContent();

            overContent.beginText();
            overContent.setFontAndSize(baseFont, 50);
            overContent.showTextAligned(Element.ALIGN_CENTER, journals.get(i).getName(), headerX, headerY, 0);
            overContent.endText();

            // Build the image path using the journal id
            String imagePath = "/media/jungle-book/" + journals.get(i).getId() + ".jpg";
            // Load the image. (Make sure the file is accessible from the file system or adjust the method as needed.)
            Image journalImage = Image.getInstance(imagePath);
            // Optionally, scale the image to fit the available space on the page
            journalImage.scaleToFit(400, 400);
            journalImage.setAbsolutePosition(imageX, imageY);


            overContent.addImage(journalImage);

            pageStamp.alterContents();
            pdfCopy.addPage(importedPage);
        }

        // Close all documents/readers
        document.close();
        templateReader.close();
        return outputStream.toByteArray();
    }
}
