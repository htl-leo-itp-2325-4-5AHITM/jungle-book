package at.htlleonding.junglebook.journal

import androidx.lifecycle.MutableLiveData
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import at.htlleonding.junglebook.checkpoint.CheckpointRepository
import kotlinx.coroutines.launch

class JournalViewModel : ViewModel() {
    private val repository = JournalRepository()
    val journals = repository.journals

    init {
        viewModelScope.launch {
            repository.fetchJournals()
        }
    }

}