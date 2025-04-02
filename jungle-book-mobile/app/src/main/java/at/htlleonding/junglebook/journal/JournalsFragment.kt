package at.htlleonding.junglebook.journal

import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import androidx.fragment.app.Fragment
import androidx.fragment.app.viewModels
import androidx.lifecycle.Observer
import androidx.recyclerview.widget.LinearLayoutManager
import at.htlleonding.junglebook.databinding.FragmentJournalsBinding

class JournalsFragment : Fragment(){
    private val viewModel: JournalViewModel by viewModels()
    private lateinit var binding: FragmentJournalsBinding

    override fun onCreateView(
        inflater: LayoutInflater,
        container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View {
        binding = FragmentJournalsBinding.inflate(inflater, container, false)
        binding.recyclerView.layoutManager = LinearLayoutManager(requireContext())
        viewModel.journals.observe(viewLifecycleOwner, Observer { journals ->
            binding.recyclerView.adapter = JournalAdapter(journals)
        })


        return binding.root
    }

}