package at.htlleonding.junglebook.checkpoint

import CheckpointAdapter
import android.os.Bundle
import android.util.Log
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import androidx.appcompat.app.AlertDialog
import androidx.fragment.app.Fragment
import androidx.fragment.app.viewModels
import androidx.lifecycle.Observer
import androidx.recyclerview.widget.LinearLayoutManager
import androidx.recyclerview.widget.RecyclerView
import at.htlleonding.junglebook.databinding.FragmentCheckpointsBinding

class CheckpointsFragment : Fragment() {
    private val viewModel: CheckpointViewModel by viewModels()
    private lateinit var binding: FragmentCheckpointsBinding

    override fun onCreateView(
        inflater: LayoutInflater, container: ViewGroup?, savedInstanceState: Bundle?
    ): View {
        binding = FragmentCheckpointsBinding.inflate(inflater, container, false)
        binding.recyclerView.layoutManager = LinearLayoutManager(requireContext())

        viewModel.checkpoints.observe(viewLifecycleOwner, Observer { checkpoints ->
            binding.recyclerView.adapter = CheckpointAdapter(checkpoints) { checkpoint ->
                showCheckpointDetails(checkpoint)
            }
        })

        return binding.root
    }

    private fun showCheckpointDetails(checkpoint: Checkpoint) {
        val dialog = AlertDialog.Builder(requireContext())
            .setTitle(checkpoint.name)
            .setMessage(String.format("%s %s\n%s\n%s", checkpoint.longitude, checkpoint.latitude, checkpoint.note, checkpoint.comment))
            .setPositiveButton("OK", null)
            .create()
        dialog.show()
    }
}