# CanvasSubtracks

Tested with JBrowse 1.16.3

Example Track Configuration:
  geneGroupAttributeName is the name of a feature attribute used to render synteny shading
  subtracks list contains "featureFilters" which are used to assign features into subtracks and "metadata" which will be used for ui/configuration puposes

{
 ....
    "style": {
        "color": "{syntenyColorFxn}",
        "connectorColor": "{syntenyColorFxn}",
        "connectorThickness": "function(f){return f.data['SynType'] === 'span' ? 3 : 1; }",
        "height": 5,
        "marginBottom": 0,
	"showLabels": false,
    },
    "geneGroupAttributeName": "orthomcl_name",
    "subtracks": [
        {
            "featureFilters": {
                "SynType": "gene",
                "Taxon": "Plasmodium falciparum 3D7"
            },
            "label": "pfal3D7 gene",
            "metadata": {
                "Class": "Aconoidasida",
                "Genus": "Plasmodium",
                "Kingdom": "N/A",
                "Phylum": "Apicomplexa",
                "Species": "Plasmodium falciparum"
            },
            "visible": true
        },
        {
            "featureFilters": {
                "SynType": "span",
                "Taxon": "Plasmodium falciparum 3D7"
            },
            "label": "pfal3D7 span",
            "metadata": {
                "Class": "Aconoidasida",
                "Genus": "Plasmodium",
                "Kingdom": "N/A",
                "Phylum": "Apicomplexa",
                "Species": "Plasmodium falciparum"
            },
            "visible": true
        },

        .....
    ],
    "type": "CanvasSubtracks/View/Track/Synteny"
}
