import { Button, ButtonGroup, Grid, GridColumn, Header } from "semantic-ui-react";
import PhotoWidgetDropzone from "./PhotoWidgetDropzone";
import { useEffect, useState } from "react";
import PhotoWidgetCropper from "./PhotoWidgetCropper";

interface Props{
    uploadPhoto: (file: Blob) => void;
    loading: boolean; 
}

export default function PhotoUploadWidget({uploadPhoto, loading}: Props) {
    const [files, setFiles] = useState<any>([]);
    const [cropper, setCropper] = useState<Cropper>();

    function onCrop() {
        if (cropper) {
            return cropper.getCroppedCanvas().toBlob(blob => uploadPhoto(blob!));
        }
    }

    useEffect(() => {
        return () => files.forEach((file: any) => URL.revokeObjectURL(file.preview))
    }, [files]);

    return (
        <Grid>
            <GridColumn width={4}>
                <Header color='teal' sub content="Step 1 - Add photo" />
                <PhotoWidgetDropzone setFiles={setFiles} />
            </GridColumn>
            <GridColumn width={2}></GridColumn>
            <GridColumn width={4}>
                <Header color='teal' sub content="Step 2 - Resize image" />
                {files && files.length > 0 && (
                    <PhotoWidgetCropper imagePreview={files[0].preview} setCropper={setCropper} />
                )}
            </GridColumn>
            <GridColumn width={2}></GridColumn>
            <GridColumn width={4}>
                <Header color='teal' sub content="Step 1 - Perview & Upload" />
                {files && files.length > 0 && (
                    <>
                        <div className="img-preview" style={{overflow: 'hidden', minHeight: 200}} />
                        <ButtonGroup>
                            <Button loading={loading} onClick={onCrop} positive icon='check' />
                            <Button disabled={loading} onClick={() => setFiles([])} icon='close' />
                        </ButtonGroup>
                    </>
                )}
            </GridColumn>
        </Grid>
    )
}