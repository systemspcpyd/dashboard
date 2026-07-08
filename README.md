# Project Architecture
This documentation provides a visual overview of our payment UAT page.

## Flowchart Diagram
*The high-level navigation and iframe routing logic.*

```mermaid
graph LR
    URL --> Index["index.html"]
    
    Index --> MPI["index-mpi-non-hosted.html"]
    Index --> PAG_Non["index-pag-non-hosted.html"]
    Index --> PAG_Hosted["pag-hosted.html"]
    Index --> Dummy["mpigwv2.html"]
    
    MPI --> MPI_L["left: mpi-non-hosted.html"]
    MPI --> MPI_R["right: test-card.html"]
    
    PAG_Non --> PAG_L["left: pag-channel.html"]
    PAG_Non --> PAG_R["right: pag-payment.html"]
    
    %% Group targets to force horizontal alignment
    subgraph Gateways [Payment Gateways]
        direction LR
        Target1["MPI<br/>devlink.paydee.co/mpi"]
        Target2["PAG<br/>devlinkv2.paydee.co/mpigw"]
        Target3["DUMMY PAG<br/>devlinkv2.paydee.co/mpigwv2"]
    end
    
    MPI_L --> Target1
    PAG_L --> Target2
    PAG_R --> Target2
    PAG_Hosted --> Target2
    Dummy --> Target3


```

## Response Flowchart Diagram
*The high-level navigation and iframe routing logic for response.*

```mermaid
graph LR
    Callback["payment-page-virid.vercel.app/api/callback"] --> API_JS["/api/callback.js"]
    
    API_JS --> IfPOST{"if POST"}
    API_JS --> IfGET{"if GET"}
    
    %% Branching logic
    IfPOST -- "Response Data" --> QR["MPI_QR_CODE"]
    IfPOST -- "Response Data" --> DATA["MPI_REDIRECT_URL <br/> MPI_REDIRECT_HTTP_DATA"]
    IfPOST -- "Response Data" --> URL_ONLY["MPI_REDIRECT_URL"]
    IfPOST -- "else" --> StatusPOST["/payment-status.html"]
    
    IfGET --> StatusGet["/payment-status.html?queryParams"]
    
    %% Subgraph to force horizontal alignment of all end-nodes
    subgraph Final_Destinations [Redirects & Status]
        direction LR
        R3["/form/redirect/redirect-03.html"]
        R1["/form/redirect/redirect-01.html"]
        R2["/form/redirect/redirect-02.html"]
        StatusPOST
        StatusGet
    end
    
    %% Connections to the aligned subgraph
    QR --> R3
    DATA --> R1
    URL_ONLY --> R2


```
