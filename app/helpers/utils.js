export let getImageUrl = (image, size) => {
	return `http://cdn.lodb.dev/media/${size}/${image.parent_id}/${image.id}_${image.name}`
};