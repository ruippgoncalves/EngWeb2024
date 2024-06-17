function createScratchEmbed(id, project) {
    ScratchEmbed.loadScratchProject(`/static/${id}/${project}`, `embed-${project}`);
}
