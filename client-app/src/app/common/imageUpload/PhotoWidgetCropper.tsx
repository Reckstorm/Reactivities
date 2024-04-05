import { Cropper } from "react-cropper";
import 'cropperjs/dist/cropper.css';

interface Props {
    imagePreview: string;
    setCropper: (cropper: Cropper) => void;
}

export default function PhotoWidgetCropper({ imagePreview, setCropper }: Props) {
    return (
        <Cropper
            src={imagePreview}
            style={{height: 200, width: '100%'}}
            preview='.img-preview'
            viewMode={1}
            initialAspectRatio={1}
            aspectRatio={1}
            autoCropArea={1}
            responsive={false}
            guides={false}
            scalable={false}
            zoomable={false}
            cropBoxResizable={false}
            minCropBoxHeight={200}
            onInitialized={setCropper}
        />
    )
}