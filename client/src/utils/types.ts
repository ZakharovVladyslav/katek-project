export interface FullDataInterface {
    LogID: number
    ProdCode: number
    Customer: string
    ProdName: string
    ArticleNum: string
    MatNum: string
    OpSystem: string
    DBAccName: string
    DBAccVers: string
    HostName: string
    WkStNmae: string
    AdpNum: string
    ProcName: string
    ProcNum: number
    WkOrder: string
    WkPlace: string
    AVO: string
    TPVersion: string
    tLogIn: string
    tLogOut: string
    tLastAcc: string
    tLatenz: number
    tLatenzSumme: number
    tCycle: number
    tProc: number
    FPY: number
    CountPass: number
    CountFail: number
    CountPass_Retest: number
    CountFail_Retest: number
    DBName: string
    DBPath: string
    ConfirmNo: number
    ConfirmCnt: number
    SAP_WkP: string
    [key: string]: any
}
