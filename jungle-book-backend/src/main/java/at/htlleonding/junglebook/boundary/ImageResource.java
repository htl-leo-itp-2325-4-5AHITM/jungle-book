package at.htlleonding.junglebook.boundary;

import io.quarkus.runtime.Quarkus;
import jakarta.inject.Inject;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import org.jboss.logging.Logger;

import java.io.File;
import java.nio.file.Files;
import java.nio.file.Paths;

@Path("/api/image")
public class ImageResource {

    @GET
    @Path("/{imageName}")
    @Produces("image/png")
    public File getImage(@PathParam("imageName") String imageName) {
        return new File("/media/" + imageName);
    }
}
