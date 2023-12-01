package at.htlleonding.junglebook.boundary;

import at.htlleonding.junglebook.repository.JournalRepository;
import io.quarkus.logging.Log;
import io.quarkus.runtime.Quarkus;
import jakarta.inject.Inject;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.*;

import org.jboss.logging.Logger;

import jakarta.ws.rs.core.MediaType;
import org.jboss.resteasy.annotations.providers.multipart.MultipartForm;

import java.io.File;
import java.io.IOException;
import java.lang.annotation.Annotation;
import java.util.Arrays;
import java.util.Locale;
import java.util.Map;
import java.util.Set;

@Path("/api/journal")
public class JournalResource {
    private static final Logger LOG = Logger.getLogger(Quarkus.class);

    @Inject
    JournalRepository journalRepository;


    @POST
    @Path("/upload-photo")
    @Consumes(MediaType.MULTIPART_FORM_DATA)
    @Produces(MediaType.APPLICATION_OCTET_STREAM)
    public Response uploadImage(byte[] image) throws IOException {
        Response response = Response
                .ok(journalRepository.addJournal(image), MediaType.APPLICATION_OCTET_STREAM)
                .header("content-disposition", "attachment; filename = new.pdf")
                .build();
        LOG.error("info" + response);
        return response;
    }
}
