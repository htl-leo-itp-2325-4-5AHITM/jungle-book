package at.htlleonding.junglebook.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.NamedQuery;

@Entity
@NamedQuery(name = Checkpoint.QUERY_GET_ALL, query = "SELECT c from Checkpoint c")
public class Checkpoint {
    public static final String QUERY_GET_ALL = "Checkpoint.getAll";

    @GeneratedValue
    @Id
    private long id;

    private String name;
    private String longitude;
    private String latitude;
    private String comment;
    private String note;

    public Checkpoint(String name, String longitude, String latitude, String comment, String note) {
        this.name = name;
        this.longitude = longitude;
        this.latitude = latitude;
        this.comment = comment;
        this.note = note;
    }

    public Checkpoint() {

    }

    public long getId() {
        return id;
    }
}
