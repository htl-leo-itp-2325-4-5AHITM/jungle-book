package at.htlleonding.junglebook.repository;

import at.htlleonding.junglebook.model.Journal;
import at.htlleonding.junglebook.service.PhotobookGenerator;
import io.quarkus.runtime.Quarkus;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.persistence.EntityManager;
import jakarta.transaction.Transactional;
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
    private PhotobookGenerator photobookGenerator = new PhotobookGenerator();

    @Inject
    EntityManager entityManager;
    @Transactional
    public void addJournal(MultipartFormDataInput image) throws IOException {
        Journal journal = new Journal();

        Map<String, List<InputPart>> uploadForm = image.getFormDataMap();
        List<InputPart> inputParts = uploadForm.get("file");

        for (InputPart inputPart : inputParts) {
            try {
                InputStream inputStream = inputPart.getBody(InputStream.class, null);
                //String fileName = getFileName(inputPart.getHeaders());
                List<InputPart> fileNameInputParts = uploadForm.get("filename");
                String fileName = fileNameInputParts.get(0).getBodyAsString();
                journal.setName(fileName);
                entityManager.persist(journal);
                Path path = Path.of("/media/jungle-book/", journal.getId() + ".jpg");
                Files.copy(inputStream, path, StandardCopyOption.REPLACE_EXISTING);
            } catch (Exception e) {
                e.printStackTrace();
            }
        }
    }

    public List<Journal> getAllJournals() {
        return entityManager.createNamedQuery(Journal.QUERY_GET_ALL, Journal.class).getResultList();
    }

    public byte[] getPhotobookFromJournals() throws Exception {
        return photobookGenerator.getPhotobook(getAllJournals());
    }
}
