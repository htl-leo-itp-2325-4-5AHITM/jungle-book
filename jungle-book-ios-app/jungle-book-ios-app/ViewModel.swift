//
//  ViewModel.swift
//  jungle-book-ios-app
//
//  Created by Schablinger Mathias on 13.03.24.
//

import Foundation
import SwiftUI
class ViewModel: ObservableObject {
    @Published private(set) var model = Model()
    
    init(model: Model){
        self.model = model;
    }
    
    var journals: [Journal] {
        model.journals
    }
    var checkpoints: [Checkpoint] {
        model.checkpoints
    }
    func setJournals(journals: [Journal]) {
        model.setJournals(journals)
    }
    func journalsLoaded(_ journals: [Journal]) {
        model.setJournals(journals)
    }
    func checkpointsLoaded(_ checkpoints: [Checkpoint]) {
        model.setCheckpoints(checkpoints)
    }
    func setCheckpoints(checkpoints: [Checkpoint]) {
        model.setCheckpoints(checkpoints)
    }
    func uploadImage(fileName: String, image: UIImage) async {
        let url = URL(string: Config.URL + "/api/journal/upload-photo")!
        var multipart = MultipartRequest()
        multipart.add(
            key: "file",
            fileName: fileName,
            fileMimeType: "image/jpg",
            fileData: image.jpegData(compressionQuality: 0.5)!
        )

        var request = URLRequest(url: url)
        request.httpMethod = "POST"
        request.setValue(multipart.httpContentTypeHeadeValue, forHTTPHeaderField: "Content-Type")
        request.httpBody = multipart.httpBody

        if let (data, response) = try? await URLSession.shared.data(for: request) {
            print((response as! HTTPURLResponse).statusCode)
            print(String(data: data, encoding: .utf8)!)
        }
    }
}
public struct MultipartRequest {
    
    public let boundary: String
    
    private let separator: String = "\n"
    private var data: Data

    public init(boundary: String = UUID().uuidString) {
        self.boundary = boundary
        self.data = .init()
    }
    
    private mutating func appendBoundarySeparator() {
        data.append("--\(boundary)\(separator)")
    }
    
    private mutating func appendSeparator() {
        data.append(separator)
    }

    private func disposition(_ key: String) -> String {
        "Content-Disposition: form-data; name=\"\(key)\""
    }

    public mutating func add(
        key: String,
        value: String
    ) {
        appendBoundarySeparator()
        data.append(disposition(key) + separator)
        appendSeparator()
        data.append(value + separator)
    }

    public mutating func add(
        key: String,
        fileName: String,
        fileMimeType: String,
        fileData: Data
    ) {
        appendBoundarySeparator()
        data.append(disposition(key) + "; filename=\"\(fileName)\"" + separator)
        data.append("Content-Type: \(fileMimeType)" + separator + separator)
        data.append(fileData)
        appendSeparator()
    }

    public var httpContentTypeHeadeValue: String {
        "multipart/form-data; boundary=\(boundary)"
    }

    public var httpBody: Data {
        var bodyData = data
        bodyData.append("--\(boundary)--")
        return bodyData
    }
}
public extension Data {

    mutating func append(
        _ string: String,
        encoding: String.Encoding = .utf8
    ) {
        guard let data = string.data(using: encoding) else {
            return
        }
        append(data)
    }
}
