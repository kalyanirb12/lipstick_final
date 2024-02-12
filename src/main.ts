import { bootstrapCameraKit, Transform2D, createMediaStreamSource } from "@snap/camera-kit";

async function main() {
    const apiToken = "eyJhbGciOiJIUzI1NiIsImtpZCI6IkNhbnZhc1MyU0hNQUNQcm9kIiwidHlwIjoiSldUIn0.eyJhdWQiOiJjYW52YXMtY2FudmFzYXBpIiwiaXNzIjoiY2FudmFzLXMyc3Rva2VuIiwibmJmIjoxNzA3MTEzMzYxLCJzdWIiOiJkMjY5ZjE3Yy1mZjdjLTRiMzQtYjBhNC1hMTY1ODQ4MGY1MzB-U1RBR0lOR345MWE0NTA5YS02OTk0LTQ5NDEtOGJiNy1mNmZkNDlhZDQ3OTMifQ.aa7S0IzXqqv42EaxuuLT_QEYX2gaz60KE2IjrSdqMtI";

    try {
        const cameraKit = await bootstrapCameraKit({ apiToken });

        const canvas = document.getElementById("my-canvas") as HTMLCanvasElement | null;

        if (!canvas) {
            console.error("Canvas element not found. Make sure the canvas element with ID 'my-canvas' exists in your HTML.");
            return;
        }

        const session = await cameraKit.createSession({ liveRenderTarget: canvas });
        session.events.addEventListener('error', (event) => {
            if (event.detail.error.name === 'LensExecutionError') {
                console.log('The current Lens encountered an error and was removed.', event.detail.error);
            }
        });

        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        const source = createMediaStreamSource(stream, { transform: Transform2D.MirrorX, cameraType: 'user' });
        await session.setSource(source);

        const lens = await cameraKit.lensRepository.loadLens("e27d32d5-1b0f-4699-8df8-e6a16d1ade36", "b8c6bfe8-e0da-4beb-b687-d18041f69dae");
        await session.applyLens(lens);

        await session.play();
        console.log("Lens rendering has started!");
    } catch (error) {
        console.error("Error initializing Camera Kit:", error);
    }
}

main();

