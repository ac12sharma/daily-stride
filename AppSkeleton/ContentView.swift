import SwiftUI

struct ContentView: View {
    var body: some View {
        VStack(spacing: 12) {
            Image(systemName: "figure.walk")
                .font(.system(size: 44))
            Text("AppSkeleton")
                .font(.title2)
                .bold()
            Text("SwiftUI base project")
                .foregroundStyle(.secondary)
        }
        .padding()
    }
}

#Preview {
    ContentView()
}
