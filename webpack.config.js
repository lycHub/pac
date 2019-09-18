const { join } = require('path');

module.exports = {
  entry: [
    join(__dirname, 'src/pages/domainManager/domainList/domainList.js'),
    join(__dirname, 'src/pages/domainManager/updateDomain/updateDomain.js'),
    join(__dirname, 'src/pages/userManager/answerList/answerList.js'),
    join(__dirname, 'src/pages/userManager/addAnswer/addAnswer.js'),
    join(__dirname, 'src/pages/userManager/answerInfo/answerInfo.js'),
    join(__dirname, 'src/pages/userManager/answerChangeInfo/answerChangeInfo.js'),
    join(__dirname, 'src/pages/userManager/answerNotCheckedInfo/answerNotCheckedInfo.js'),
    join(__dirname, 'src/pages/userManager/balanceRecord/balanceRecord.js'),
    join(__dirname, 'src/pages/userManager/answerCheckList/answerCheckList.js'),
    join(__dirname, 'src/pages/userManager/answerChangeInfoCheckList/answerChangeInfoCheckList.js'),
    join(__dirname, 'src/pages/userManager/answerChangeInfoCheck/answerChangeInfoCheck.js'),
    join(__dirname, 'src/pages/userManager/answerCheck/answerCheck.js'),
    join(__dirname, 'src/pages/userManager/pac/table/table.js'),

    join(__dirname, 'src/pages/orderManager/faqManager/faqManager.js'),
    join(__dirname, 'src/pages/accountManager/userAccountList/userAccountList.js'),


    join(__dirname, 'src/pages/contentManagement/answerAuditFailed/answerAuditFailed.js'),
    join(__dirname, 'src/pages/contentManagement/answerReviewed/answerReviewed.js'),
    join(__dirname, 'src/pages/contentManagement/audienceDetails/audienceDetails.js'),
    join(__dirname, 'src/pages/contentManagement/problemManagement/problemList.js'),
    join(__dirname, 'src/pages/contentManagement/auditing/auditing.js'),
    join(__dirname, 'src/pages/contentManagement/published/published.js'),
    join(__dirname, 'src/pages/contentManagement/replacer/replacer.js'),
    join(__dirname, 'src/pages/contentManagement/replyAnswer/replyAnswer.js'),
    join(__dirname, 'src/pages/contentManagement/answerManagement/answerList.js'),
    join(__dirname, 'src/pages/contentManagement/audienceManagement/audienceList.js'),
  ],
    devServer: {
      host: "192.168.212.99",
      port: "4200",
      proxy: {
        '/qa': {
          target: 'http://192.168.205.11:8091',  // 测试
          changeOrigin: true
        }
      }
    },
    devtool: 'cheap-module-eval-source-map'
}