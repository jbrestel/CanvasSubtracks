# CanvasSubtracks (View)

Tested with JBrowse 1.16.3

Example Track Configuration:
* geneGroupAttributeName:  An attribute of the features which indicates the group.  Features with the same value for this attribute will be connected with shading.
* subtracks:   list which contains "featureFilters" and "metadata" objects.  featureFilters are used to assign features into subtracks and "metadata" is used for configuration/subtrack selection.

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

For Canvas Subtracks without Synteny Shading simply remove the geneGroupAttributeName and change the type to "CanvasSubtracks/View/Track/CanvasSubtracks"


# Store

Tested with REST, GFF, NCList which should work fine if you are displaying static alignments.

This plugin provides "CanvasFeatures/Store/SeqFeature/REST" which will add 2 query params to the service call (visibleRegionStart and visibleRegionEnd).  This allows the service to do whatever scaling is appropriate for the syntenic region.

# data workflow in a nutshell

Most of the heavy lifting is done upstream of this plugin.  One possible approach is:

#Perform all possible pairwise comparisons of genomes and determine all large regions of synteny (we use mercator and MAVID)
#For each syntenic region, determine the coordinate pairs for each syntenic gene's start to the corresponding gene start in the reference.  
#Create a REST endpoint which when given an arbitrary region (visibleRegionStart->visibleRegionEnd) can get the min and max coord pair for the region and scale the syntenic locations so they can be shown in reference coordinates.

# Funding
This plugin was made possible by funding provided by the NIH:National Institute of Allergy and Infectious Diseases (NIAID) to the EuPathDB Bioinformatics Resource Center (BRC).
