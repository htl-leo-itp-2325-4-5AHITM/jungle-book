package at.htlleonding.junglebook.boundary;

import jakarta.ws.rs.*;

import java.io.File;

@Path("/image")
public class ImageResource {
    /**
     * Returns the image with the given name.
     *
     * @param imageName The name of the image.
     * @return The image file.
     */
    @GET
    @Path("/{id}")
    @Produces("image/jpg")
    public File getImage(@PathParam("id") int id) {
        return new File("/media/jungle-book/" + id + ".jpg");
    }
}
