//
//  ContentView.swift
//  jungle-book-ios-app
//
//  Created by Schablinger Mathias on 15.02.24.
//
//

import SwiftUI
import CoreData
import MapKit

struct ContentView: View {
    @ObservedObject var viewModel: ViewModel;
    var body: some View {
        
        //        HStack {
        //            NavigationLink(destination: AccountView()) {
        //                Image(systemName: "person.crop.circle")
        //            }
        //        }
        TabView {
            PhotoView(viewModel: viewModel).tabItem {
                Image(systemName: "camera")
                Text("Photos")
            }
            ExplorerView(viewModel: viewModel).tabItem {
                Image(systemName: "map.fill")
                Text("Explorer")
            }.task {
                let checkpoints = await loadAllCheckpoints()
                viewModel.checkpointsLoaded(checkpoints)
            }
            PhotobookView(viewModel: viewModel).tabItem {
                Image(systemName: "book.closed.fill")
                Text("Photobook")
            }.task {
                let journals = await loadAllJournals()
                viewModel.journalsLoaded(journals)
            }
        }.task {
            let journals = await loadAllJournals()
            viewModel.journalsLoaded(journals)
            
            let checkpoints = await loadAllCheckpoints()
            viewModel.checkpointsLoaded(checkpoints)
        }
    }
}
public struct PhotoView: View {
    /* @State private var showCamera = false
     @State private var selectedImage: UIImage?
     @State var image: UIImage?
     public var body: some View {
     VStack {
     Text("Take a photo").font(.system(size: 25));
     
     if let selectedImage{
     Image(uiImage: selectedImage)
     .resizable()
     .scaledToFit()
     } else {
     Image(systemName: "camera").font(.system(size: 200))
     }
     
     Button("Take picture") {
     self.showCamera.toggle()
     }.buttonStyle(.bordered)
     }
     } */
    @State private var isShowingImagePicker = false
    @State private var inputImage: UIImage?
    @ObservedObject var viewModel: ViewModel;
    @State private var name: String = ""
    public var body: some View {
        VStack {
            Text("Take Photo").font(.system(size: 25));
            TextField("Journal Name", text: $name).border(.secondary)
            Button {
                self.isShowingImagePicker = true
            } label: {
                Image(systemName: "camera").resizable().aspectRatio(contentMode:.fit)
                    .frame(height: 32.0);
            }
            if let inputImage = self.inputImage {
                Image(uiImage: inputImage)
                    .resizable()
                    .scaledToFit()
            }
        }.textFieldStyle(.roundedBorder)
        .sheet(isPresented: $isShowingImagePicker, onDismiss: {
            Task {
                await loadImage()
            }
        }) {
            ImagePicker(image: self.$inputImage)
        }
    }
    
    func loadImage() async{
        guard let inputImage = inputImage else { return }
        await viewModel.uploadImage(fileName: name, image: inputImage)
    }
}
public struct ExplorerView: View {
    @ObservedObject var viewModel: ViewModel;
    
    public var body: some View {
        VStack {
            Text("Find checkpoints").font(.system(size: 25));
            List(viewModel.checkpoints) { checkpoint in
                            CheckpointView(checkpoint: checkpoint)
                                .padding(.vertical, 5)
                        }
                        .navigationTitle("Checkpoints")

            //Image(systemName: "map.fill").font(.system(size: 200))
        }
    }
}
struct CheckpointView: View {
    let checkpoint: Checkpoint
    @State private var isExpanded = false
    
    var body: some View {
        VStack(alignment: .leading) {
            HStack {
                Text(checkpoint.name)
                    .font(.headline)
                Spacer()
                Image(systemName: isExpanded ? "chevron.up" : "chevron.down")
                    .foregroundColor(.blue)
            }
            .onTapGesture {
                withAnimation {
                    isExpanded.toggle()
                }
            }
            
            if isExpanded {
                Text("Coordinates: \(checkpoint.longitude) \(checkpoint.latitude)")
                    .font(.subheadline)
                    .padding(.top, 2)
                Text("Comment: \(checkpoint.comment)").font(.subheadline)
                    .padding(.top, 2)
                Text("Note: \(checkpoint.note)").font(.subheadline)
                    .padding(.top, 2)
                
            }
        }
        .padding()
        .background(Color(UIColor.secondarySystemBackground))
        .cornerRadius(10)
        .shadow(radius: 5)
    }
}
struct PhotobookView: View {
    @ObservedObject var viewModel: ViewModel;
    
    var body: some View {
        VStack {
            Text("Your Journals").font(.system(size: 25));
            List(viewModel.journals) {
                journal in
                //  Text("\(journal.name)");
                // JournalView(name: journal.name, image: journal.image)
                
                HStack {
                    Image(systemName: "bookmark.fill").font(.system(size: 25))
                    Spacer()
                    VStack {
                        Text("\(journal.name)").font(.system(.title));
                        //https://student.cloud.htl-leonding.ac.at/m.schablinger/api/image/
                        AsyncImage(url: URL(string: Config.URL + "/api/image/" + journal.image)){ result in
                            result.image?
                                .resizable()
                        }
                        .frame(width: 300, height: 200)
                    }
                    Spacer()
                }
            }
        }
        
    }
    
}
struct JournalView: View {
    var name: String
    var image: String
    
    var body: some View {
        HStack {
            Image(systemName: "bookmark.fill").font(.system(size: 25))
            Spacer()
            VStack {
                Text(name).font(.system(.title));
                Image(systemName: image).font(.system(size: 50))
            }
            Spacer()
        }
    }
}

//public struct AccountView: View {
//    public var body: some View {
//        VStack {
//            Image(systemName: "person.crop.circle").font(.system(size:35))
//            Text("Johne Doe").font(.system(size:20))
//            TabView {
//                PhotobookView().tabItem {
//                    Image(systemName: "book.closed.fill")
//                    Text("Journals")
//                }
//                CommentView().tabItem {
//                    Image(systemName: "bubble.left.fill")
//                    Text("Comments")
//                }
//            }
//        }
//    }
//}
//struct CommentView: View {
//    public var body: some View {
//        VStack {
//
//        }
//    }
//}
struct ContentView_Previews: PreviewProvider {
    
    static var model: Model = Model();
    static let viewModel: ViewModel = ViewModel(model: model);
    
    
    static var previews: some View {
        ContentView(viewModel: viewModel)
    }
}


struct ImagePicker: UIViewControllerRepresentable {
    @Environment(\.presentationMode) var presentationMode
    @Binding var image: UIImage?
    
    func makeUIViewController(context: UIViewControllerRepresentableContext<ImagePicker>) -> UIImagePickerController {
        let picker = UIImagePickerController()
        picker.delegate = context.coordinator
        return picker
    }
    
    func updateUIViewController(_ uiViewController: UIImagePickerController, context: UIViewControllerRepresentableContext<ImagePicker>) {}
    
    func makeCoordinator() -> Coordinator {
        Coordinator(self)
    }
    
    class Coordinator: NSObject, UINavigationControllerDelegate, UIImagePickerControllerDelegate {
        var parent: ImagePicker
        
        init(_ parent: ImagePicker) {
            self.parent = parent
        }
        
        func imagePickerController(_ picker: UIImagePickerController, didFinishPickingMediaWithInfo info: [UIImagePickerController.InfoKey : Any]) {
            if let uiImage = info[.originalImage] as? UIImage {
                parent.image = uiImage
            }
            
            parent.presentationMode.wrappedValue.dismiss()
        }
    }
}

