package at.htlleonding.junglebook.checkpoint

import androidx.lifecycle.LiveData
import androidx.lifecycle.MutableLiveData
import at.htlleonding.junglebook.RetrofitInstance

class CheckpointRepository {
    private val _checkpoints = MutableLiveData<List<Checkpoint>>()
    val checkpoints: LiveData<List<Checkpoint>> get() = _checkpoints
    suspend fun fetchCheckpoints() {
        val response = RetrofitInstance.api.getCheckpoints()
        if (response.isSuccessful) {
            _checkpoints.postValue(response.body())
        }
    }
}