package at.htlleonding.junglebook.boundary;

import at.htlleonding.junglebook.repository.ImageRepository;
import jakarta.inject.Inject;
import jakarta.ws.rs.NotFoundException;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.PathParam;

import java.io.File;

@Path("/api/image")
public class ImageResource {
    @Inject
    ImageRepository imageRepository;

    @Path("/{imageName}")
    public File getImage(@PathParam("imageName") String imageName) {
        try {
            return new File(getClass().getResource("img/" + imageName).getFile());
        } catch (Exception e) {
            throw new NotFoundException();
        }
    }
}
