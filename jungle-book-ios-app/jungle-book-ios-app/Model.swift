//
//  Model.swift
//  jungle-book-ios-app
//
//  Created by Schablinger Mathias on 13.03.24.
//

import Foundation
struct Journal: Identifiable, Codable, Hashable {
    var id: Int
    var name: String = ""
    var image: String = ""
}
struct Model {
    private(set) var journals = [Journal]()
    private(set) var checkpoints = [Checkpoint]()
    
    mutating func setJournals(_ loadedJournals : [Journal]) {
        journals = loadedJournals
    }
    
    mutating func setCheckpoints(_ loadedCheckpoints: [Checkpoint]) {
        checkpoints = loadedCheckpoints
    }
}
struct Checkpoint: Identifiable, Codable, Hashable {
    var id: Int
    var name: String = ""
    var longitude: String = ""
    var latitude: String = ""
    var comment: String = ""
    var note: String = ""
    var coordinates: String {
        "Coordinates: \(longitude) \(latitude)"
    }
}
