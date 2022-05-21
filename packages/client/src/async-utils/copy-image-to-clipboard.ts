/**
 * Only images with mime type of "image/png" are supported.
 * @param imageElement
 */
export const copyImageToClipboard = async (imageElement: any) => {
    let canvas = document.createElement('canvas');
    canvas.width = imageElement.width;
    canvas.height = imageElement.height;
    let ctx = canvas.getContext('2d');
    ctx?.drawImage(imageElement, 0, 0);

    const dataURL = canvas.toDataURL();
    const blob = await (await fetch(dataURL)).blob();
    // @ts-ignore TS2339
    // missing type definition of method `write` due to typescript version
    // it's actually exist: https://developer.mozilla.org/en-US/docs/Web/API/Clipboard/write
    await navigator.clipboard.write([
        new ClipboardItem({
            'image/png': blob
        })
    ]);
};
