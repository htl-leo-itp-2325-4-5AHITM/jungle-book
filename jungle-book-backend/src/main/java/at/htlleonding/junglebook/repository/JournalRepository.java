package at.htlleonding.junglebook.repository;

import at.htlleonding.junglebook.model.Journal;
import io.quarkus.runtime.Quarkus;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.persistence.EntityManager;
import jakarta.transaction.Transactional;
import jakarta.ws.rs.core.MultivaluedMap;
import org.apache.commons.io.output.ByteArrayOutputStream;
import org.apache.pdfbox.Loader;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.pdmodel.PDPage;
import org.apache.pdfbox.pdmodel.PDPageContentStream;
import org.apache.pdfbox.pdmodel.graphics.image.PDImageXObject;
import org.apache.pdfbox.text.PDFTextStripper;
import org.jboss.logging.Logger;
import org.jboss.resteasy.plugins.providers.multipart.InputPart;
import org.jboss.resteasy.plugins.providers.multipart.MultipartFormDataInput;

import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.StandardCopyOption;
import java.util.List;
import java.util.Map;

@ApplicationScoped
public class JournalRepository {
    private static final Logger LOG = Logger.getLogger(Quarkus.class);
    @Inject
    EntityManager entityManager;
    @Transactional
    public void addJournal(MultipartFormDataInput image) throws IOException {
        Journal journal = new Journal();
        /*PDDocument document;
        try (InputStream is = getClass().getResourceAsStream("/pdf/Photobook design.pdf")) {
            byte[] byteArray = is.readAllBytes();
            document = Loader.loadPDF(byteArray);
        }
        PDPage page = document.getPage(0);
        LOG.info("page created");

        PDImageXObject pdImage = PDImageXObject.createFromByteArray(document, image, "image");

        try (PDPageContentStream contentStream = new PDPageContentStream(document, page, PDPageContentStream.AppendMode.APPEND, true)) {
            contentStream.drawImage(pdImage, 150, 400);
            LOG.info("image drawn");
        } catch (Exception e) {
            LOG.error("image draw failed");
            throw new RuntimeException(e);
        }

        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        document.save(baos);
        document.close();
        LOG.info("page saved and closed");

        return baos.toByteArray();*/
        Map<String, List<InputPart>> uploadForm = image.getFormDataMap();
        List<InputPart> inputParts = uploadForm.get("file");

        for (InputPart inputPart : inputParts) {
            try {
                InputStream inputStream = inputPart.getBody(InputStream.class, null);
                //String fileName = getFileName(inputPart.getHeaders());
                List<InputPart> fileNameInputParts = uploadForm.get("filename");
                String fileName = fileNameInputParts.get(0).getBodyAsString();
                Path path = Path.of("/media/jungle-book/", fileName.toLowerCase().replaceAll("\\s+", "-") + ".jpg");
                Files.copy(inputStream, path, StandardCopyOption.REPLACE_EXISTING);
                journal.setImage(fileName.toLowerCase().replaceAll("\\s+", "-"));
                journal.setName(fileName);
            } catch (Exception e) {
                e.printStackTrace();
            }
        }
        entityManager.persist(journal);
    }
    private String getFileName(MultivaluedMap<String, String> header) {
        String[] contentDisposition = header.getFirst("Content-Disposition").split(";");
        for (String filename : contentDisposition) {
            if ((filename.trim().startsWith("filename"))) {
                String[] name = filename.split("=");
                return name[1].trim().replaceAll("\"", "");
            }
        }
        return "unknown";
    }

    public List<Journal> getAllJournals() {
        return entityManager.createNamedQuery(Journal.QUERY_GET_ALL, Journal.class).getResultList();
    }
}
