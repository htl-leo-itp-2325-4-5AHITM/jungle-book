//
//  JournalService.swift
//  jungle-book-ios-app
//
//  Created by Schablinger Mathias on 13.03.24.
//

import Foundation
//fileprivate let journalUrlString = "https://student.cloud.htl-leonding.ac.at./m.schablinger/api/journal/list"
fileprivate let journalUrlString = Config.URL + "/api/journal/list"
func loadAllJournals() async -> [Journal] {
    var journals: [Journal] = [Journal]()
    let url: URL = URL(string: journalUrlString)!
    if let (data, _) = try? await URLSession.shared.data(from: url) {
        if let loadedJournals = try? JSONDecoder().decode([Journal].self, from: data) {
            journals = loadedJournals
        } else {
            print("failed to decode journal")
        }
    } else {
        print("failed to load url journal")
    }
    
    return journals
}
