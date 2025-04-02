//
//  CheckpointService.swift
//  jungle-book-ios-app
//
//  Created by Schablinger Mathias on 18.04.24.
//

import Foundation
fileprivate let checkpointUrlString = Config.URL + "/api/checkpoint/list"
func loadAllCheckpoints() async -> [Checkpoint] {
    var checkpoints: [Checkpoint] = [Checkpoint]()
    let url: URL = URL(string: checkpointUrlString)!
    if let (data, _) = try? await URLSession.shared.data(from: url) {
        if let loadedCheckpoints = try? JSONDecoder().decode([Checkpoint].self, from: data) {
            checkpoints = loadedCheckpoints
        } else {
            print("failed to decode checkpoint")
        }
    } else {
        print("failed to load url checkpoint")
    }
    
    return checkpoints
}
