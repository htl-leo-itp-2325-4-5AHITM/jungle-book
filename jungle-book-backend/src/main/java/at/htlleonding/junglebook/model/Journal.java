package at.htlleonding.junglebook.model;

import jakarta.persistence.*;

import java.io.File;

@Entity
public class Journal {
    @GeneratedValue
    @Id
    private Long id;

    //Many Journals Have One user how to map this in jpa hibernate orm

    @ManyToOne
    @JoinColumn(name="account_id", referencedColumnName = "id")
    private Account account;

    private String name;

    @ManyToOne
    @JoinColumn(name="checkpoint_id", referencedColumnName = "id")
    private Checkpoint checkpoint;

    private File image;

    //<editor-fold desc="//getter and setter">
    public Long getId() {
        return id;
    }

    public Checkpoint getCheckpoint() {
        return checkpoint;
    }

    public void setCheckpoint(Checkpoint checkpoint) {
        this.checkpoint = checkpoint;
    }

    public Account getAccount() {
        return account;
    }

    public void setAccount(Account user) {
        this.account = user;
    }

    public String getName() {
        return name;
    }

    public void setName(String journalName) {
        this.name = journalName;
    }
    //</editor-fold>
}
