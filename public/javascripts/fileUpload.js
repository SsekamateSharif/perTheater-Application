// here we will configure and initialise our filepond 
// we first register its plugins that we installed and we will use i our project
FilePond.registerPlugin(
    FilePondPluginFileEncode,
    FilePondPluginImagePreview,
    FilePondPluginImageResize
);
// then we configure and style our filepond design
FilePond.setOptions({
    stylePanelAspectRatio: 150/100,
    imageResizeTargetWidth: 100,
    imageResizeTargetHeight: 150
});

// we initialise our filepond and also pass it for usage in our filepond class inputs 
FilePond.parse(document.body);