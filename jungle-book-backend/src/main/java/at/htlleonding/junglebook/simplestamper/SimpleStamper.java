package at.htlleonding.junglebook.simplestamper;

/*
 * A Simple PDF Stamper using PDFBox
 *
 * July, 2013
 * @author jack
 */


import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.pdmodel.PDPage;
import org.apache.pdfbox.pdmodel.PDPageContentStream;
import org.apache.pdfbox.pdmodel.common.PDRectangle;
import org.apache.pdfbox.pdmodel.font.PDFont;

import java.awt.*;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.lang.reflect.Field;
import java.util.Properties;

/**
 *
 * @author jack
 */
public class SimpleStamper {

    private static int numPages;
    private static Properties config = new Properties();
    private static String configFile;
    private static String outputFN = null;
    private static String inputFN = null;
    private static String stampString = null;
    private static String fontFamily = null;
    private static Float fontSize = null;
    private static Integer textRot = null;
    private static Color color = null;
    private static Boolean invertY = false;

    /**
     * Our Constructor
     */
    public SimpleStamper() {
        super();
    }

    /**
     * The main class. It's what plants crave.
     *
     * @param args the command line arguments args[0] -> The config file args[1]
     * -> The PDF document to be stamped args[2] -> The string to stamp
     * (optional, falls back to ss.text in the config file) args[3] -> The
     * desired name and path of the stamped PDF (optional, also defined in
     * config file as ss.outputFN)
     */
    public static void main(String[] args) throws IOException, NoSuchFieldException, IllegalArgumentException, IllegalAccessException {

        // as if we were outside...
        SimpleStamper app = new SimpleStamper();

        // if we don't have any parameters...
        if (args.length == 0) {
            usage();
        } else {

            // the config file path
            configFile = args[0];

            // load the config
            loadConfig(configFile, args);

        }
        // stamp
        app.stamp();
    }

    /**
     * Loads the configuration data.
     * Note: If we add many more config values, this function should be revised as a fetching routine.
     *
     * @param configFile
     * @param args
     * @throws NoSuchFieldException
     * @throws IllegalArgumentException
     * @throws IllegalAccessException
     */
    public static void loadConfig(String configFile, String[] args) throws NoSuchFieldException, IllegalArgumentException, IllegalAccessException {

        // the input stream
        InputStream is;

        try {
            is = new FileInputStream(configFile);

            try {
                // try to load the config file
                config.load(is);
                is.close();
            } catch (IOException e) {
                System.out.println(e);
            }
        } catch (IOException e) {
            System.out.println(e);
        }

        // the input PDF filename/path
        if (args.length > 1) {
            inputFN = args[1];
        } else {
            // make sure we have an input filename
            try {
                inputFN = config.getProperty("ss.inputFN");
            } catch (NullPointerException e) {
                System.err.println("You must specify an input filename as the second argument, or in the properties file. (ss.inputFN)");
            }

        }

        // the string to be stamped
        if (args.length > 2) {
            stampString = args[2];
        } else {
            // make sure we have a string to stamp
            try {
                stampString = config.getProperty("ss.text");
            } catch (NullPointerException e) {
                System.err.println("You must specify a string to stamp as the third argument, or in the properties file. (ss.text)");
            }

        }

        // the output PDF filename/path
        if (args.length > 3) {
            outputFN = args[3];
        } else {
            // make sure we have an output filename
            try {
                outputFN = config.getProperty("ss.outputFN");
            } catch (NullPointerException e) {
                System.err.println("You must specify an output filename as the fourth argument, or in the properties file. (ss.outputFN)");
            }

        }

        // make sure we have a font from the prop file
        try {
            fontFamily = config.getProperty("ss.fontFamily");
        } catch (NullPointerException e) {
            System.err.println("You must specify a font in the properties file. (ss.fontFamily)");
        }

        // make sure we have a font size from the prop file
        try {
            fontSize = Float.parseFloat(config.getProperty("ss.fontSize"));
        } catch (NullPointerException e) {
            System.err.println("You must specify a font size in the properties file. (ss.fontSize)");
        }

        // text rotation
        // make sure we have a font size from the prop file
        try {
            textRot = Integer.parseInt(config.getProperty("ss.rotation"));
        } catch (NullPointerException e) {
            System.err.println("You must specify a rotation in the properties file. (ss.rotation)");
        }

        // text color. if not set in the properties file we default to black
        try {
            Field field = Color.class.getField(config.getProperty("ss.fontColor"));
            color = (Color) field.get(null);
        } catch (NullPointerException e) {
            System.err.println("You must specify a font color in the properties file. (ss.fontColor)");
        }

        // the Y value inversion bool. Do we calc yVal from the top or bottom of the page?
        invertY = "true".equals(config.getProperty("ss.invertY")) ? true : false;
    }

    /**
     * The Stamping function. Where the magic lives.
     *
     * @throws IOException
     */
    public void stamp() throws IOException {

        // the document
        PDDocument doc = null;

        try {
            // load the incoming document into a PDDcoument
            doc = PDDocument.load(inputFN);

            // make a list array of all the pages
            List allPages = doc.getDocumentCatalog().getAllPages();

            // Create a new font object selecting one of the PDF base fonts
            PDFont font = PDType1Font.getStandardFont(fontFamily);

            // the x/y coords
            float xVal = Float.parseFloat(config.getProperty("ss.xVal"));
            float yVal = Float.parseFloat(config.getProperty("ss.yVal"));

            // for every page in the incoming doc, stamp
            for (int i = 0; i < allPages.size(); i++) {
                // create an empty page and a geo object to use for calcs
                PDPage page = (PDPage) allPages.get(i);
                PDRectangle pageSize = page.findMediaBox();

                // are we inverting the y axis?
                if (invertY) {
                    yVal = pageSize.getHeight() - yVal;
                }

                // calculate the width of the string according to the font
                float stringWidth = font.getStringWidth(stampString) * fontSize / 1000f;

                // determine the rotation stuff. Is the the loaded page in landscape mode? (for axis and string dims)
                int pageRot = page.findRotation();
                boolean pageRotated = pageRot == 90 || pageRot == 270;

                // are we rotating the text?
                boolean textRotated = textRot != 0 || textRot != 360;

                // calc the diff of rotations so the text stamps
                int totalRot = pageRot - textRot;

                // calc the page dimensions
                float pageWidth = pageRotated ? pageSize.getHeight() : pageSize.getWidth();
                float pageHeight = pageRotated ? pageSize.getWidth() : pageSize.getHeight();

                // determine the axis of rotation
                double centeredXPosition = pageRotated ? pageHeight / 2f : (pageWidth - stringWidth) / 2f;
                double centeredYPosition = pageRotated ? (pageWidth - stringWidth) / 2f : pageHeight / 2f;

                // append the content to the existing stream
                PDPageContentStream contentStream = new PDPageContentStream(doc, page, true, true, true);
                contentStream.beginText();

                // set font and font size
                contentStream.setFont(font, fontSize);

                // set the stroke (text) color
                contentStream.setNonStrokingColor(color);

                // if we are rotating, do it
                if (pageRotated) {

                    // rotate the text according to the calculations above
                    contentStream.setTextRotation(Math.toRadians(totalRot), centeredXPosition, centeredYPosition);

                } else if (textRotated) {

                    // rotate the text according to the calculations above
                    contentStream.setTextRotation(Math.toRadians(textRot), xVal, yVal);

                } else {

                    // no rotate, just move it.
                    contentStream.setTextTranslation(xVal, yVal);
                }

                // stamp the damned text already
                contentStream.drawString(stampString);

                // close and clean up
                contentStream.endText();
                contentStream.close();
            }

            doc.save(outputFN);

        } finally { // you know, PHP 5.5 now has a finally construct...

            // if the document isnt closed, do so
            if (doc != null) {
                doc.close();
            }

        }
    }

    /**
     * Attempts to provide basic usage info.
     */
    private static void usage() {
        System.err.println("usage: java -jar simplestamper \"PdfToStamp.pdf\" \"The text to stamp, in parenthesis.\" \"Output.pdf\"");
    }
}
