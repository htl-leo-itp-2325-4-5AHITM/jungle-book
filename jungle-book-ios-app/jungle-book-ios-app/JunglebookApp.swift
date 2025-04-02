//
//  JunglebookApp.swift
//  jungle-book-ios-app
//
//  Created by Schablinger Mathias on 15.02.24.
//
//

import SwiftUI
fileprivate let model = Model()
@main
struct JunglebookApp: App {

    var viewModel = ViewModel(model: model)
        
    var body: some Scene {
        WindowGroup {
            ContentView(viewModel: viewModel)
        }
    }
}
