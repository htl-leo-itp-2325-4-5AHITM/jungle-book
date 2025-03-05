package at.htlleonding.junglebook.service;

import at.htlleonding.junglebook.model.Journal;
import com.itextpdf.text.Document;
import com.itextpdf.text.Element;
import com.itextpdf.text.Image;
import com.itextpdf.text.pdf.*;
import com.itextpdf.text.PageSize;
import com.itextpdf.text.pdf.parser.PdfTextExtractor;
import com.itextpdf.text.pdf.parser.Vector;
import com.itextpdf.text.BaseColor;

import java.awt.*;
import java.io.ByteArrayOutputStream;
import java.io.FileNotFoundException;
import java.io.InputStream;
import java.util.List;

public class PhotobookGenerator {

    public byte[] getPhotobook(List<Journal> journals) throws Exception {
        // Lade das Template
        InputStream templateStream = getClass().getResourceAsStream("/pdf/Photobook design.pdf");
        if (templateStream == null) {
            throw new FileNotFoundException("Template PDF '/pdf/Photobook design.pdf' not found.");
        }

        PdfReader templateReader = new PdfReader(templateStream);
        int templatePageCount = templateReader.getNumberOfPages();

        // Das Ausgabestream für das endgültige PDF
        ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
        Document document = new Document(PageSize.A4.rotate());  // Querformat
        PdfCopy pdfCopy = new PdfCopy(document, outputStream);
        document.open();

        // Benutzte Schriftarten
        BaseFont baseFont = BaseFont.createFont(BaseFont.HELVETICA_BOLD, BaseFont.WINANSI, BaseFont.NOT_EMBEDDED);
        BaseFont regularFont = BaseFont.createFont(BaseFont.HELVETICA, BaseFont.WINANSI, BaseFont.NOT_EMBEDDED);

        // Farbgestaltung für Text und Elemente
        BaseColor titleColor = new BaseColor(34, 139, 34);  // Dschungelgrün
        BaseColor textColor = new BaseColor(0, 0, 0);  // Standard Schwarz für normalen Text

        // Berechnen, wie viele Bilder pro Seite platziert werden können
        int imagesPerRow = 3;  // Anzahl der Bilder pro Reihe
        int imagesPerColumn = 2;  // Anzahl der Bilder pro Spalte
        float imageWidth = 200f;  // Bildbreite
        float imageHeight = 200f; // Bildhöhe

        float xOffset = 50f;  // Horizontaler Abstand
        float yOffset = 150f; // Vertikaler Abstand

        int totalImages = journals.size();
        int imagesPerPage = imagesPerRow * imagesPerColumn;

        // Text, der in den Header eingefügt werden soll (z.B. "Auf den Spuren des Dschungels")
        String headerText = "Auf den Spuren des Dschungels";

        for (int i = 0; i < totalImages; i++) {
            // Neue Seite erstellen, wenn der Platz für Bilder voll ist
            int templatePageNumber = 0;
            if (i % imagesPerPage == 0) {
                // Lade die entsprechende Seite aus dem Template
                templatePageNumber = (i % templatePageCount) + 1;
                PdfImportedPage importedPage = pdfCopy.getImportedPage(templateReader, templatePageNumber);
                PdfCopy.PageStamp pageStamp = pdfCopy.createPageStamp(importedPage);

                // Erstelle Inhalt zum Bearbeiten der Seite
                PdfContentByte overContent = pageStamp.getOverContent();

                // Titel im Header (z. B. "Auf den Spuren des Dschungels")
                overContent.beginText();
                overContent.setFontAndSize(baseFont, 50);  // Große Schrift für den Titel
                overContent.setColorFill(titleColor);  // Dschungelgrün
                overContent.showTextAligned(Element.ALIGN_CENTER, headerText, document.getPageSize().getWidth() / 2, 700f, 0);
                overContent.endText();

                pageStamp.alterContents();
                pdfCopy.addPage(importedPage);
            }

            // Berechne die Position für das Bild
            float xPosition = xOffset + (i % imagesPerRow) * (imageWidth + 20f);  // 20px Abstand zwischen den Bildern
            float yPosition = yOffset + (i / imagesPerRow) * (imageHeight + 20f);

            // Lade das Bild
            String imagePath = "/media/jungle-book/" + journals.get(i).getId() + ".jpg";
            Image journalImage = Image.getInstance(imagePath);
            journalImage.setAbsolutePosition(xPosition, yPosition);
            journalImage.scaleToFit(imageWidth, imageHeight);

            // Lade die Seite aus dem Template
            PdfImportedPage importedPage = pdfCopy.getImportedPage(templateReader, templatePageNumber);
            PdfCopy.PageStamp pageStamp = pdfCopy.createPageStamp(importedPage);

            // Zugriff auf den OverContent der Seite (Hier fügst du das Bild hinzu)
            PdfContentByte overContent = pageStamp.getOverContent();
            overContent.addImage(journalImage);

            // Bestätige die Änderungen
            pageStamp.alterContents();

            // Füge die bearbeitete Seite zum PDF hinzu
            pdfCopy.addPage(importedPage);


            // Optional: Füge einen Text unter dem Bild hinzu (z.B. Journalname)
            String journalName = journals.get(i).getName();
            overContent.beginText();
            overContent.setFontAndSize(regularFont, 20);
            overContent.setColorFill(textColor);  // Standardfarbe für Text
            overContent.showTextAligned(Element.ALIGN_LEFT, journalName, xPosition, yPosition - 20f, 0); // Unter dem Bild
            overContent.endText();

            // Wenn alle Bilder auf der Seite hinzugefügt wurden, zur nächsten Seite wechseln
            if ((i + 1) % imagesPerPage == 0) {
                pdfCopy.addPage(pdfCopy.getImportedPage(templateReader, 1));
            }
        }

        document.close();
        templateReader.close();
        return outputStream.toByteArray();
    }
}