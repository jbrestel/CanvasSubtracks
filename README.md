# CanvasSubtracks

Tested with JBrowse 1.16.3

Example Track Configuration:
  geneGroupAttributeName is the name of a feature attribute used to render synteny shading
  subtracks list contains "featureFilters" which are used to assign features into subtracks and "metadata" which will be used for configuration/subtrack selection.

<pre>
{
 ....
    "type": "CanvasSubtracks/View/Track/Synteny"
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
	....
    ]
}
</pre>
