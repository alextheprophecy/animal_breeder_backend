const Replicate = require("replicate")
const replicate = new Replicate({
    auth: process.env.REPLICATE_API_TOKEN
});

/**
 * @param prompt text prompt
 * @param new_options
 * @return Promise<String[]> list of image result urls
 */

//seed for pto0.4: 3914204369- cartoon
const queryProteus = (prompt, new_options) => {
    const options = {seed:2736712215, outputs:2}
    Object.assign(options, new_options)

    return replicate.run(
        "lucataco/proteus-v0.2:06775cd262843edbde5abab958abdbb65a0a6b58ca301c9fd78fa55c775fc019",
        {
            input: {
                seed: options.seed,
                width: 640,
                height: 640,
                prompt: prompt,
                scheduler: "KarrasDPM",
                num_outputs: options.outputs,
                guidance_scale: 7.5,
                apply_watermark: false,
                negative_prompt: "worst quality, low quality, background, cartoon, 3D render, toy, plushie, blurry, nsfw, human",
                prompt_strength: 0.8,
                num_inference_steps: 20
            }
        }
    ).then(o=>o[0])
}

module.exports = {
    queryProteus
}