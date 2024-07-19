const { removeBackground } = require('@imgly/background-removal-node');

// Function to remove background from an image
removeImageBackground = (imgSource) => {
    return removeBackground(imgSource).then(blob=>
        blob.arrayBuffer().then(array_buffer =>
            `data:image/png;base64,${Buffer.from(array_buffer).toString("base64")}`
        )
    )
}

module.exports = {
    removeImageBackground
}