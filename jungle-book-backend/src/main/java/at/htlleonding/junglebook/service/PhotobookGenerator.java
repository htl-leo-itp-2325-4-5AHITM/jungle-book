package at.htlleonding.junglebook.service;

import at.htlleonding.junglebook.model.Journal;
import com.itextpdf.text.Document;
import com.itextpdf.text.DocumentException;
import com.itextpdf.text.Element;
import com.itextpdf.text.Image;
import com.itextpdf.text.pdf.*;
import com.itextpdf.text.pdf.parser.*;

import java.io.*;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

public class PhotobookGenerator {
    public byte[] getPhotobook(List<Journal> journals) throws Exception {
        for (int i = 0; i < journals.size(); i++) {
            if(i == 0) {
                int test = i+1;
                overlayImagesOnText("/pdf/Photobook design.pdf", "tempPdf.pdf", String.format("!$%d?$",test), journals.get(i));
            }
            if (i <= 5) {
                int test = i+1;
                overlayImagesOnText("tempPdf.pdf", "tempPdf.pdf", String.format("!$%d?$",test), journals.get(i));
            }
        }
        PdfReader reader = new PdfReader("tempPdf.pdf");
        return convertPdfReaderToByteArrayOutputStream(reader).toByteArray();
    }
    private static ByteArrayOutputStream convertPdfReaderToByteArrayOutputStream(PdfReader reader)
            throws IOException, DocumentException {
        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        PdfStamper stamper = new PdfStamper(reader, baos);
        stamper.close();
        reader.close();
        return baos;
    }
    public void overlayImagesOnText(String inputPdf, String outputPdf,
                                           String textToReplace, Journal journal)
            throws IOException, DocumentException {

        // Find all occurrences of the text
        List<TextRectangle> textLocations = findTextInPdf(inputPdf, textToReplace);

        if (textLocations.isEmpty()) {
            System.out.println("Text '" + textToReplace + "' not found in the document.");
            return;
        }

        // Open the PDF for modification
        PdfReader reader = new PdfReader(inputPdf);
        PdfStamper stamper = new PdfStamper(reader, new FileOutputStream(outputPdf));

        // Load the image to place
        Image image = Image.getInstance("/media/jungle-book/" + journal.getId() + ".jpg");

        // For each found text location, place an image
        for (TextRectangle location : textLocations) {
            // Get the overlay canvas for the page
            PdfContentByte canvas = stamper.getOverContent(location.getPage());

            // Position and scale the image to match the text dimensions
            image.setAbsolutePosition(location.getLlx(), location.getLly());
            image.scaleToFit(location.getWidth(), location.getHeight());

            // Add the image to the page
            canvas.addImage(image);
        }

        // Close resources
        stamper.close();
        reader.close();
    }

    public List<TextRectangle> findTextInPdf(String pdfPath, final String searchText)
            throws IOException {
        System.out.println(pdfPath);
        final List<TextRectangle> results = new ArrayList<>();
        PdfReader reader;
        if(pdfPath.equals("/pdf/Photobook design.pdf")) {
            reader = new PdfReader(Objects.requireNonNull(getClass().getResourceAsStream(pdfPath)));
        } else {
            reader = new PdfReader(pdfPath);
        }


        // Process each page of the PDF
        for (int page = 1; page <= reader.getNumberOfPages(); page++) {
            final int currentPage = page;

            // Create a text extraction strategy that captures text positions
            TextExtractionStrategy strategy = new TextExtractionStrategy() {
                private final List<TextRectangle> pageResults = new ArrayList<>();

                @Override
                public String getResultantText() {
                    // Add page results to the overall results
                    results.addAll(pageResults);
                    return "";
                }

                @Override
                public void beginTextBlock() {}

                @Override
                public void renderText(TextRenderInfo renderInfo) {
                    String text = renderInfo.getText();
                    System.out.println(text);
                    System.out.println(searchText);
                    if (text != null && text.contains(searchText)) {
                        // Get text boundaries
                        Vector baseStart = renderInfo.getBaseline().getStartPoint();
                        Vector baseEnd = renderInfo.getBaseline().getEndPoint();

                        // Calculate ascent for height
                        float ascent = renderInfo.getAscentLine().getStartPoint().get(1) -
                                renderInfo.getBaseline().getStartPoint().get(1);

                        // Calculate descent for complete height
                        float descent = renderInfo.getBaseline().getStartPoint().get(1) -
                                renderInfo.getDescentLine().getStartPoint().get(1);

                        // Create rectangle with text boundaries
                        float x = baseStart.get(0);
                        float y = baseStart.get(1) - descent; // Lower-left y
                        float width = baseEnd.get(0) - baseStart.get(0);
                        float height = ascent + descent;

                        // Store the text position
                        pageResults.add(new TextRectangle(currentPage, x, y, width, height));
                    }
                }

                @Override
                public void endTextBlock() {}

                @Override
                public void renderImage(ImageRenderInfo renderInfo) {}
            };

            // Extract text with the strategy
            PdfTextExtractor.getTextFromPage(reader, currentPage, strategy);
        }

        reader.close();
        return results;
    }

    /**
     * Class to hold information about a text location in a PDF
     */
    public static class TextRectangle {
        private final int page;
        private final float llx; // lower left x
        private final float lly; // lower left y
        private final float width;
        private final float height;

        public TextRectangle(int page, float llx, float lly, float width, float height) {
            this.page = page;
            this.llx = llx;
            this.lly = lly;
            this.width = width;
            this.height = height;
        }

        public int getPage() { return page; }
        public float getLlx() { return llx; }
        public float getLly() { return lly; }
        public float getWidth() { return width; }
        public float getHeight() { return height; }
    }
}
