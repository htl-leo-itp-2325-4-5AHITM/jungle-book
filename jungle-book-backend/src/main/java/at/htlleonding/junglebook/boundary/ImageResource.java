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
    @Path("/{imageName}")
    @Produces("image/jpg")
    public File getImage(@PathParam("imageName") String imageName) {
        return new File("/media/jungle-book/" + imageName + ".jpg");
    }
}
