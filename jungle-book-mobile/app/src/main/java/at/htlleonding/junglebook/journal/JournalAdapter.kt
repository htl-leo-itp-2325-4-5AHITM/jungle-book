package at.htlleonding.junglebook.journal

import android.view.LayoutInflater
import android.view.ViewGroup
import androidx.recyclerview.widget.RecyclerView
import at.htlleonding.junglebook.databinding.JournalBinding
import com.squareup.picasso.Picasso

class JournalAdapter(private val journals: List<Journal>) : RecyclerView.Adapter<JournalAdapter.JournalViewHolder>() {

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): JournalViewHolder {
        val binding = JournalBinding.inflate(LayoutInflater.from(parent.context), parent, false)
        return JournalViewHolder(binding)
    }


    override fun onBindViewHolder(holder: JournalViewHolder, position: Int) {
        holder.bind(journals[position])
    }

    override fun getItemCount(): Int = journals.size

    class JournalViewHolder(private val binding: JournalBinding) : RecyclerView.ViewHolder(binding.root) {
        fun bind(journal: Journal) {
            binding.textView.text = journal.name
            Picasso.get().load("https://it200247.cloud.htl-leonding.ac.at/api/image/"+journal.id).into(binding.imageView)
        }
    }
}