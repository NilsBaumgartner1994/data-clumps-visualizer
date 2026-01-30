import React, {FunctionComponent, useMemo, useState} from 'react';
import Graph from "react-graph-vis";
import {
    DataClumpsVariableFromContext,
    DataClumpsTypeContext,
    DataClumpTypeContext
} from "data-clumps-type-context";
import {Button} from "primereact/button";
import { v4 as uuidv4 } from 'uuid'

const COLOR_UNI_ROT = "#ac0634";
const COLOR_UNI_GELB = "#fbb900"
const COLOR_UNI_GRAU = "#cfcfcf"


const COLOR_PRIMARY = undefined;
const COLOR_PALETTES = generateColorPaletteFromColor(COLOR_PRIMARY);

const COLOR_FILE = COLOR_PALETTES.color_file || COLOR_UNI_GRAU
const COLOR_FILE_TEXT = calculateBestTextColor(COLOR_FILE);
const COLOR_CLASS = COLOR_PALETTES.color_class || COLOR_UNI_GRAU
const COLOR_CLASS_TEXT = calculateBestTextColor(COLOR_CLASS);
const COLOR_METHOD = COLOR_PALETTES.color_method || COLOR_UNI_GELB
const COLOR_METHOD_TEXT = calculateBestTextColor(COLOR_METHOD);
const COLOR_PARAMETER = COLOR_PALETTES.color_parameter || COLOR_UNI_ROT
const COLOR_PARAMETER_TEXT = calculateBestTextColor(COLOR_PARAMETER);
const COLOR_FIELD = COLOR_PALETTES.color_field || COLOR_UNI_ROT
const COLOR_FIELD_TEXT = calculateBestTextColor(COLOR_FIELD);

function generateColorPaletteFromColor(baseColor: string | undefined){
    function adjustBrightness(color: string | undefined, percent) {
        if(!color){
            return undefined;
        }

        // Convert hex to RGB
        const num = parseInt(color.replace("#", ""), 16);
        const r = (num >> 16) + percent;
        const g = ((num >> 8) & 0x00FF) + percent;
        const b = (num & 0x0000FF) + percent;

        // Ensure RGB stays within 0-255
        const newR = Math.min(Math.max(0, r), 255);
        const newG = Math.min(Math.max(0, g), 255);
        const newB = Math.min(Math.max(0, b), 255);

        // Convert back to hex
        return `#${((1 << 24) + (newR << 16) + (newG << 8) + newB)
            .toString(16)
            .slice(1)}`;
    }

    let isDark = false;
    const COLOR_BLACK = "#000000";
    let bestTextColor = calculateBestTextColor(baseColor);
    if(bestTextColor===COLOR_BLACK){
        isDark = true;
    }

    let multiplier = -1;
    if(isDark){
        multiplier = 1;
    }

    return {
        color_file: adjustBrightness(baseColor, multiplier*160), // Darker than base
        color_class: adjustBrightness(baseColor, multiplier*120), // Slightly darker than base
        color_method: adjustBrightness(baseColor, multiplier*80), // Slightly lighter than base
        color_parameter: baseColor, // Original base color
        color_field: adjustBrightness(baseColor, multiplier*40), // Lighter than base
    };
}

function calculateBestTextColor(backgroundColor: string | undefined){
    const COLOR_BLACK = "#000000";
    const COLOR_WHITE = "#FFFFFF";

    if(!backgroundColor){
        return undefined
    }

    // only black or white for text
    let color = backgroundColor;
    if(color.startsWith("#")){
        color = color.substring(1);
    }
    // calculate highest contrast color
    let r = parseInt(color.substring(0,2),16);
    let g = parseInt(color.substring(2,4),16);
    let b = parseInt(color.substring(4,6),16);
    let yiq = ((r*299)+(g*587)+(b*114))/1000;
    return (yiq >= 128) ? COLOR_BLACK : COLOR_WHITE;
}

// @ts-ignore
export interface DataClumpsGraphProps {
    key: string,
    dataClumpsDict: DataClumpsTypeContext | null,
    from_file_path?: string | null | undefined,
    to_file_path?: string | null | undefined,
    dark_mode?: boolean
}

export const DataClumpsGraph : FunctionComponent<DataClumpsGraphProps> = (props: DataClumpsGraphProps) => {

    const [a, setA] = useState();

    const dark_mode = props?.dark_mode;
    let dataClumpsDict = props.dataClumpsDict;
    const from_file_path = props?.from_file_path;
    const to_file_path = props?.to_file_path;

    const version = useMemo(uuidv4, [dataClumpsDict,from_file_path,to_file_path,dark_mode])

    //const [dataClumpsDict, setDataClumpsDict] = useSynchedDataClumpsDict(); // we wont use synched variable here, since we want to export our functionality outside
//    const [showLargeGraph, setShowLargeGraph] = useState(false);
    const showLargeGraph = true;
    const setShowLargeGraph = (bool) => {

    };

    function getInitialGraphFromDataClumpsDict(dataClumpsDict: DataClumpsTypeContext | null){
        //console.log("getInitialGraphFromDataClumpsDict");

        let from_file_path: string | null | undefined = props?.from_file_path;
        let to_file_path: string | null | undefined = props?.to_file_path;

        let files_dict = {};
        let classes_dict = {};
        let fields_dict = {};
        let methods_dict = {};
        let parameters_dict = {};

        if(dataClumpsDict){

            let dataClumps = dataClumpsDict?.data_clumps || {};
            let dataClumpsKeys = Object.keys(dataClumps);
            for(let dataClumpKey of dataClumpsKeys){
                let dataClump = dataClumps[dataClumpKey];

                let file_path = dataClump.from_file_path;

                let shouldAnalyzeFile = true;

                if(from_file_path){
                    shouldAnalyzeFile = file_path === from_file_path
                }

                if(shouldAnalyzeFile){
                    let data_clump_data_dict = dataClump.data_clump_data;
                    let dataClumpDataKeys = Object.keys(data_clump_data_dict);
                    for(let dataClumpDataKey of dataClumpDataKeys){
                        let dataClumpData = data_clump_data_dict[dataClumpDataKey];
                        initNodesForDataClumpData(dataClump, dataClumpData, files_dict, classes_dict, fields_dict, methods_dict, parameters_dict);
                    }
                }
            }
        }

        let nodes: any[] = [];
        let edges: any[] = [];

        const openArrowEdge = {
            arrows: {
                to: {
                    enabled: true,
                    type: "vee",
                }
            }
        };

        let graph = {
            nodes: nodes,
            edges: edges
        }

        let files_dict_keys = Object.keys(files_dict);
        for(let file_dict_key of files_dict_keys){
            let file_dict_value = files_dict[file_dict_key];
            // @ts-ignore
            graph.nodes.push(file_dict_value);
            let classes_or_interfaces_ids = file_dict_value.classes_or_interfaces_ids;
            let classes_or_interfaces_ids_keys = Object.keys(classes_or_interfaces_ids);
            for(let classes_or_interfaces_ids_key of classes_or_interfaces_ids_keys){
                graph.edges.push({
                    // @ts-ignore
                    from: file_dict_value.id,
                    // @ts-ignore
                    to: classes_or_interfaces_ids_key,
                    ...openArrowEdge,
                });
            }
        }

        let classes_dict_keys = Object.keys(classes_dict);
        for(let class_dict_key of classes_dict_keys){
            let class_dict_value = classes_dict[class_dict_key];
            // @ts-ignore
            graph.nodes.push(class_dict_value);
            let field_ids = class_dict_value.field_ids;
            let field_ids_keys = Object.keys(field_ids);
            for(let field_ids_key of field_ids_keys){
                graph.edges.push({
                    // @ts-ignore
                    from: class_dict_value.id,
                    // @ts-ignore
                    to: field_ids_key,
                    ...openArrowEdge,
                });
            }

            let method_ids = class_dict_value.method_ids;
            let method_ids_keys = Object.keys(method_ids);
            for(let method_ids_key of method_ids_keys){
                graph.edges.push({
                    // @ts-ignore
                    from: class_dict_value.id,
                    // @ts-ignore
                    to: method_ids_key,
                    ...openArrowEdge,
                });
            }
        }

        let fields_dict_keys = Object.keys(fields_dict);
        for(let field_dict_key of fields_dict_keys){
            let field_dict_value = fields_dict[field_dict_key];
            // @ts-ignore
            graph.nodes.push(field_dict_value);

            let related_to = field_dict_value.related_to;
            let related_to_keys = Object.keys(related_to);
            for(let related_to_key of related_to_keys){
                graph.edges.push({
                    // @ts-ignore
                    from: field_dict_value.id,
                    // @ts-ignore
                    to: related_to_key,
                });
            }
        }

        let method_ids = Object.keys(methods_dict);
        for(let method_id of method_ids){
            let method_dict_value = methods_dict[method_id];
            // @ts-ignore
            graph.nodes.push(method_dict_value);
            let parameter_ids = method_dict_value.parameter_ids;
            let parameter_ids_keys = Object.keys(parameter_ids);
            for(let parameter_ids_key of parameter_ids_keys){
                graph.edges.push({
                    // @ts-ignore
                    from: method_dict_value.id,
                    // @ts-ignore
                    to: parameter_ids_key,
                    ...openArrowEdge,
                });
            }
        }

        let parameters_dict_keys = Object.keys(parameters_dict);
        for(let parameter_dict_key of parameters_dict_keys){
            let parameter_dict_value = parameters_dict[parameter_dict_key];
            // @ts-ignore
            graph.nodes.push(parameter_dict_value);

            let related_to = parameter_dict_value.related_to;
            let related_to_keys = Object.keys(related_to);
            for(let related_to_key of related_to_keys){
                graph.edges.push({
                    // @ts-ignore
                    from: parameter_dict_value.id,
                    // @ts-ignore
                    to: related_to_key,
                });
            }
        }

        return graph;
    }

    function getRawFileNode(file_path, files_dict: any){
        let file_node = files_dict[file_path];
        let file_name = file_path
        try{
            file_name = file_path.split("/").pop();
        } catch (e) {
            // could not split file_path, so just use file_path as file_name
        }

        if(!file_node){
            file_node = {
                id: file_path,
                label: file_name,
                color: COLOR_FILE,
                font: { color: COLOR_FILE_TEXT },
                classes_or_interfaces_ids: {},
            }
            files_dict[file_node.id] = file_node;
        }
        return file_node;
    }

    function getRawClassesOrInterfacesNode(classOrInterface_key: string, classOrInterface_name: string, classes_dict: any){
        //console.log("getRawClassesOrInterfacesNode: classOrInterface");
        //console.log(classOrInterface)
        let class_or_interface_node = classes_dict[classOrInterface_key];
        if(!class_or_interface_node){
            class_or_interface_node = {
                id: classOrInterface_key,
                label: classOrInterface_name,
                color: COLOR_CLASS,
                font: { color: COLOR_CLASS_TEXT },
                field_ids: {},
                method_ids: {},
            }
            classes_dict[class_or_interface_node.id] = class_or_interface_node;
        }
        return class_or_interface_node;
    }

    function getRawMethodNode(method_key: string, method_name: string, methods_dict: any){
        let method_node = methods_dict[method_key];
        if(!method_node){
            method_node = {
                id: method_key,
                label: method_name,
                color: COLOR_METHOD,
                font: { color: COLOR_METHOD_TEXT },
                parameter_ids: {},
            }
            methods_dict[method_node.id] = method_node;
        }
        return method_node;
    }

    function getRawParameterNode(parameter_key: string, parameter_name: string, parameters_dict: any){
        let parameter_node = parameters_dict[parameter_key];
        if(!parameter_node){
            parameter_node = {
                id: parameter_key,
                label: parameter_name,
                color: COLOR_PARAMETER,
                font: { color: COLOR_PARAMETER_TEXT },
                related_to: {},
            }
            parameters_dict[parameter_node.id] = parameter_node;
        }
        return parameter_node;
    }

    function createRawLinkBetweenParameterOrFieldNodes(field_node: any, related_to_field_node: any){
        field_node.related_to[related_to_field_node.id] = related_to_field_node.id;
        related_to_field_node.related_to[field_node.id] = field_node.id;
    }

    function initNodesForDataClumpData(dataClumpHolder: DataClumpTypeContext, dataClumpData: DataClumpsVariableFromContext, files_dict, classes_dict, fields_dict, methods_dict, parameters_dict){

        let data_clump_type = dataClumpHolder.data_clump_type;
        if(data_clump_type==="parameters_to_parameters_data_clump"){
            //console.log("parameter_data_clump")
            //console.log(dataClumpData);

            let file_path_from = dataClumpHolder.from_file_path;
            let file_node_from = getRawFileNode(file_path_from, files_dict);

            let classOrInterfaceKey_from = dataClumpHolder.from_class_or_interface_key;
            let classOrInterfaceName_from = dataClumpHolder.from_class_or_interface_name;

            let class_or_interface_node_from = getRawClassesOrInterfacesNode(classOrInterfaceKey_from, classOrInterfaceName_from, classes_dict);
            file_node_from.classes_or_interfaces_ids[class_or_interface_node_from.id] = class_or_interface_node_from.id;

            let file_path_to = dataClumpHolder.to_file_path;
            let file_node_to = getRawFileNode(file_path_to, files_dict);

            let classOrInterfaceKey_to = dataClumpHolder.to_class_or_interface_key;
            let classOrInterfaceName_to = dataClumpHolder.to_class_or_interface_name;

            let class_or_interface_node_to = getRawClassesOrInterfacesNode(classOrInterfaceKey_to, classOrInterfaceName_to, classes_dict);
            file_node_to.classes_or_interfaces_ids[class_or_interface_node_to.id] = class_or_interface_node_to.id;


            let method_key_from = dataClumpHolder.from_method_key+"";
            let method_name_from = dataClumpHolder.from_method_name+"";
            let method_node_from = getRawMethodNode(method_key_from, method_name_from, methods_dict);
            class_or_interface_node_from.method_ids[method_node_from.id] = method_node_from.id;

            let method_key_to = dataClumpHolder.to_method_key+"";
            let method_name_to = dataClumpHolder.to_method_name+"";
            let method_node_to = getRawMethodNode(method_key_to, method_name_to, methods_dict);
            class_or_interface_node_to.method_ids[method_node_to.id] = method_node_to.id;


            let parameter_key_from = dataClumpData.key;
            let parameter_name_from = dataClumpData.name;
            let parameter_node_from = getRawParameterNode(parameter_key_from, parameter_name_from, parameters_dict);
            method_node_from.parameter_ids[parameter_node_from.id] = parameter_node_from.id;

            let parameter_key_to = dataClumpData.to_variable.key;
            let parameter_name_to = dataClumpData.to_variable.name;
            let parameter_node_to = getRawParameterNode(parameter_key_to, parameter_name_to, parameters_dict);
            method_node_to.parameter_ids[parameter_node_to.id] = parameter_node_to.id;

            createRawLinkBetweenParameterOrFieldNodes(parameter_node_from, parameter_node_to);

        }

        else if(data_clump_type==="fields_to_fields_data_clump"){

            let file_path_from = dataClumpHolder.from_file_path;
            let file_node_from = getRawFileNode(file_path_from, files_dict);

            let classOrInterfaceKey_from = dataClumpHolder.from_class_or_interface_key;
            let classOrInterfaceName_from = dataClumpHolder.from_class_or_interface_name;

            let class_or_interface_node_from = getRawClassesOrInterfacesNode(classOrInterfaceKey_from, classOrInterfaceName_from, classes_dict);
            file_node_from.classes_or_interfaces_ids[class_or_interface_node_from.id] = class_or_interface_node_from.id;

            let file_path_to = dataClumpHolder.to_file_path;
            let file_node_to = getRawFileNode(file_path_to, files_dict);

            let classOrInterfaceKey_to = dataClumpHolder.to_class_or_interface_key;
            let classOrInterfaceName_to = dataClumpHolder.to_class_or_interface_name;

            let class_or_interface_node_to = getRawClassesOrInterfacesNode(classOrInterfaceKey_to, classOrInterfaceName_to, classes_dict);
            file_node_to.classes_or_interfaces_ids[class_or_interface_node_to.id] = class_or_interface_node_to.id;


            let parameter_key_from = dataClumpData.key;
            let parameter_name_from = dataClumpData.name;
            let parameter_node_from = getRawParameterNode(parameter_key_from, parameter_name_from, parameters_dict);
            class_or_interface_node_from.field_ids[parameter_node_from.id] = parameter_node_from.id;

            let parameter_key_to = dataClumpData.to_variable.key;
            let parameter_name_to = dataClumpData.to_variable.name;
            let parameter_node_to = getRawParameterNode(parameter_key_to, parameter_name_to, parameters_dict);
            class_or_interface_node_to.field_ids[parameter_node_to.id] = parameter_node_to.id;

            createRawLinkBetweenParameterOrFieldNodes(parameter_node_from, parameter_node_to);

        } else if(data_clump_type==="parameters_to_fields_data_clump"){

            let file_path_from = dataClumpHolder.from_file_path;
            let file_node_from = getRawFileNode(file_path_from, files_dict);

            let classOrInterfaceKey_from = dataClumpHolder.from_class_or_interface_key;
            let classOrInterfaceName_from = dataClumpHolder.from_class_or_interface_name;

            let class_or_interface_node_from = getRawClassesOrInterfacesNode(classOrInterfaceKey_from, classOrInterfaceName_from, classes_dict);
            file_node_from.classes_or_interfaces_ids[class_or_interface_node_from.id] = class_or_interface_node_from.id;

            let file_path_to = dataClumpHolder.to_file_path;
            let file_node_to = getRawFileNode(file_path_to, files_dict);

            let classOrInterfaceKey_to = dataClumpHolder.to_class_or_interface_key;
            let classOrInterfaceName_to = dataClumpHolder.to_class_or_interface_name;

            let class_or_interface_node_to = getRawClassesOrInterfacesNode(classOrInterfaceKey_to, classOrInterfaceName_to, classes_dict);
            file_node_to.classes_or_interfaces_ids[class_or_interface_node_to.id] = class_or_interface_node_to.id;


            let method_key_from = dataClumpHolder.from_method_key+"";
            let method_name_from = dataClumpHolder.from_method_name+"";
            let method_node_from = getRawMethodNode(method_key_from, method_name_from, methods_dict);
            class_or_interface_node_from.method_ids[method_node_from.id] = method_node_from.id;


            let parameter_key_from = dataClumpData.key;
            let parameter_name_from = dataClumpData.name;
            let parameter_node_from = getRawParameterNode(parameter_key_from, parameter_name_from, parameters_dict);
            method_node_from.parameter_ids[parameter_node_from.id] = parameter_node_from.id;

            let parameter_key_to = dataClumpData.to_variable.key;
            let parameter_name_to = dataClumpData.to_variable.name;
            let parameter_node_to = getRawParameterNode(parameter_key_to, parameter_name_to, parameters_dict);
            class_or_interface_node_to.field_ids[parameter_node_to.id] = parameter_node_to.id;

            //createRawLinkBetweenParameterOrFieldNodes(parameter_node_from, parameter_node_to);

            // is uni-directional so only from the parameter to the field
            parameter_node_from.related_to[parameter_node_to.id] = parameter_node_to.id;


        }
    }



//    const [state, setState] = useState({
    let state = {
        counter: 5,
        graph: getInitialGraphFromDataClumpsDict(dataClumpsDict),
        /**        graph: {
         nodes: [
         { id: 1, label: "Node 1", color: "#e04141" },
         { id: 2, label: "Node 2", color: "#e09c41" },
         { id: 3, label: "Node 3", color: "#e0df41" },
         { id: 4, label: "Node 4", color: "#7be041" },
         { id: 5, label: "Node 5", color: "#41e0c9" }
         ],
         edges: [
         { from: 1, to: 2 },
         { from: 1, to: 3 },
         { from: 2, to: 4 },
         { from: 2, to: 5 }
         ]
         }, */
        events: {
            select: ({ nodes, edges }) => {
                console.log("Selected nodes:");
                console.log(nodes);
                console.log("Selected edges:");
                console.log(edges);
            }
        }
    }
//);
    const { graph, events } = state;

    function renderGraph(){

        const edgesColor = dark_mode ? "#ffffff" : "#000000";

        const options = {
            layout: {
                hierarchical: false,
            },
            edges: {
                color: edgesColor
            },
            nodes: {
                shape: "box",
                shapeProperties: {
                    borderRadius: 8,
                },
            },
        };


        const events = {
            select: function(event) {
                var { nodes, edges } = event;
            }
        };
        return (
            <Graph key={version} graph={graph} options={options} events={events} style={{ height: "100%", width: "100%" }} />
        );
    }

    let amountNodes = graph?.nodes?.length || 0;
    let amountEdges = graph?.edges?.length || 0;

    function renderSecureGraph(){
        let largeGraph = amountNodes > 1000;
        if(largeGraph && !showLargeGraph){
            return(
                <div style={{height: "100%", width: "100%", backgroundColor: "transparent"}}>
                    <div style={{height: "100%", width: "100%", display: "flex", alignItems: "center", flexDirection: "column"}} >
                        <div style={{display: "block"}}>
                            <h1>Graph is very large</h1>
                            <div>Nodes: {amountNodes}</div>
                            <div>Edges: {amountEdges}</div>
                            <h2>{"Select a specific file"}</h2>
                        </div>
                        <div style={{paddingTop: "30px", paddingBottom: "30px"}}>{"or"}</div>
                        <Button
                            className="p-button-danger"
                            icon="pi pi-exclamation-triangle"
                            label={"Show large graph"}
                            onClick={() => {
                                setShowLargeGraph(true);
                            }}/>
                    </div>
                </div>
            )
        } else {
            return renderGraph();
        }
    }

    return(
        <div style={{height: "100%", width: "100%", backgroundColor: "transparent"}}>
            <div style={{height: "100%", width: "100%"}} >
                {renderSecureGraph()}
            </div>
        </div>
    )

}
