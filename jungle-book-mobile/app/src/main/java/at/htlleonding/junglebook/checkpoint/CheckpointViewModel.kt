package at.htlleonding.junglebook.checkpoint

import androidx.lifecycle.MutableLiveData
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import kotlinx.coroutines.launch

class CheckpointViewModel: ViewModel() {
    private val repository = CheckpointRepository()
    val checkpoints = repository.checkpoints

    init {
        viewModelScope.launch {
            repository.fetchCheckpoints()
        }
    }


}