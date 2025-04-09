package at.htlleonding.junglebook.journal

import androidx.lifecycle.LiveData
import androidx.lifecycle.MutableLiveData
import at.htlleonding.junglebook.RetrofitInstance

class JournalRepository {
    private val _journals = MutableLiveData<List<Journal>>()
    val journals: LiveData<List<Journal>> get() = _journals
    suspend fun fetchJournals() {
        val response = RetrofitInstance.api.getJournals()
        if (response.isSuccessful) {
            _journals.postValue(response.body())
        }
    }
}