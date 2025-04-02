import android.util.Log
import android.view.LayoutInflater
import android.view.ViewGroup
import androidx.recyclerview.widget.RecyclerView
import at.htlleonding.junglebook.checkpoint.Checkpoint
import at.htlleonding.junglebook.databinding.CheckpointBinding

class CheckpointAdapter(private val checkpoints: List<Checkpoint>, private val onItemClick: (Checkpoint) -> Unit) : RecyclerView.Adapter<CheckpointAdapter.CheckpointViewHolder>() {

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): CheckpointViewHolder {
        val binding = CheckpointBinding.inflate(LayoutInflater.from(parent.context), parent, false)
        return CheckpointViewHolder(binding)
    }

    override fun onBindViewHolder(holder: CheckpointViewHolder, position: Int) {
        holder.bind(checkpoints[position])
        holder.itemView.setOnClickListener {
            onItemClick(checkpoints[position])
        }
    }

    override fun getItemCount(): Int = checkpoints.size

    class CheckpointViewHolder(private val binding: CheckpointBinding) : RecyclerView.ViewHolder(binding.root) {
        fun bind(checkpoint: Checkpoint) {
            binding.nameTextView.text = checkpoint.name
        }
    }
}