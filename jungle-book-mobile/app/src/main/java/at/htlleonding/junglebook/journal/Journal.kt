package at.htlleonding.junglebook.journal

import at.htlleonding.junglebook.checkpoint.Checkpoint

data class Journal(var id: Int, var name: String, var checkpoint: Checkpoint, var image: String) {

}