async function loadMotto() {
  try {
    const res = await fetch('files/js/mottos.json');
    const mottos = await res.json();
    const mottoElem = document.getElementById('motto');
    if (mottoElem && mottos.length) {
      mottoElem.innerText = mottos[Math.floor(Math.random() * mottos.length)];
    }
  } catch (e) {
    console.error('Failed to load mottos', e);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  loadContent('home');
  loadMotto();
  document.querySelectorAll('.nav-bar a').forEach(link => {
    link.addEventListener('click', e => {
      e.preventDefault();
      const contentId = link.getAttribute('href').substring(1);
      loadContent(contentId);
    });
  });
});

function loadContent(contentId) {
        const contentMap = {
          home: "<p>每一个人在本性上都想求知。</p><p>人出于本性的求知是为知而知、为智慧而求智慧的思辨活动，不服从任何物质利益和外在目的，因此是最自由的学问。</p><h2>欢迎来到哈三中哲学社团。</h2>",
          about:
            "<h2>关于我们</h2><p>哈三中哲学社团成立于2022年，致力于推广哲学知识、举办哲学研讨。</p>",
          library: `<h2>在线文库</h2>
      <p>我们的文库旨在为大家提供学习和研究的资料，下载后请在24小时内删除，勿用作商业用途。若您想贡献一些资料，请联系我们。</p>
      <ul>
        <span>未分类：</span>
        <ul>
          <li>
            <a
              href="https://fs-im-kefu.7moor-fs1.com/29397395/4d2c3f00-7d4c-11e5-af15-41bf63ae4ea0/1709913141113/共产党宣言.pdf"
              target="_blank"
              rel="noopener noreferrer"
              >共产党宣言.pdf</a
            >
          </li>
          <li>
            <a
              href="https://fs-im-kefu.7moor-fs1.com/29397395/4d2c3f00-7d4c-11e5-af15-41bf63ae4ea0/1709913142068/马克思：资本论（第二卷）.pdf"
              target="_blank"
              rel="noopener noreferrer"
              >马克思：资本论（第二卷）.pdf</a
            >
          </li>
          <li>
            <a
              href="https://fs-im-kefu.7moor-fs1.com/29397395/4d2c3f00-7d4c-11e5-af15-41bf63ae4ea0/1709913141277/家庭、私有制和国家的起源.pdf"
              target="_blank"
              rel="noopener noreferrer"
              >家庭、私有制和国家的起源.pdf</a
            >
          </li>
          <li>
            <a
              href="https://fs-im-kefu.7moor-fs1.com/29397395/4d2c3f00-7d4c-11e5-af15-41bf63ae4ea0/1709913141434/经典密码学与现代密码学【上】.pdf"
              target="_blank"
              rel="noopener noreferrer"
              >经典密码学与现代密码学【上】.pdf</a
            >
          </li>
          <li>
            <a
              href="https://fs-im-kefu.7moor-fs1.com/29397395/4d2c3f00-7d4c-11e5-af15-41bf63ae4ea0/1709913156276/马克思：资本论（第一卷）.pdf"
              target="_blank"
              rel="noopener noreferrer"
              >马克思：资本论（第一卷）.pdf</a
            >
          </li>
          <li>
            <a
              href="https://fs-im-kefu.7moor-fs1.com/29397395/4d2c3f00-7d4c-11e5-af15-41bf63ae4ea0/1709913155960/马克思：资本论（第三卷）.pdf"
              target="_blank"
              rel="noopener noreferrer"
              >马克思：资本论（第三卷）.pdf</a
            >
          </li>
          <li>
            <a
              href="https://fs-im-kefu.7moor-fs1.com/29397395/4d2c3f00-7d4c-11e5-af15-41bf63ae4ea0/1709913141594/经典密码学与现代密码学【下】.pdf"
              target="_blank"
              rel="noopener noreferrer"
              >经典密码学与现代密码学【下】.pdf</a
            >
          </li>
          <li>
            <a
              href="https://fs-im-kefu.7moor-fs1.com/29397395/4d2c3f00-7d4c-11e5-af15-41bf63ae4ea0/1709913178291/亚文化 风格的意义.pdf"
              target="_blank"
              rel="noopener noreferrer"
              >亚文化 风格的意义.pdf</a
            >
          </li>
          <li>
            <a
              href="https://fs-im-kefu.7moor-fs1.com/29397395/4d2c3f00-7d4c-11e5-af15-41bf63ae4ea0/1709913141755/精神分析引论.pdf"
              target="_blank"
              rel="noopener noreferrer"
              >精神分析引论.pdf</a
            >
          </li>
          <li>
            <a
              href="https://fs-im-kefu.7moor-fs1.com/29397395/4d2c3f00-7d4c-11e5-af15-41bf63ae4ea0/1709913173287/新教伦理与资本主义精神_（德）马克斯·韦伯著_上海人民出版社,2010.pdf"
              target="_blank"
              rel="noopener noreferrer"
              >新教伦理与资本主义精神_（德）马克斯·韦伯著_上海人民出版社,2010.pdf</a
            >
          </li>
          <li>
            <a
              href="https://fs-im-kefu.7moor-fs1.com/29397395/4d2c3f00-7d4c-11e5-af15-41bf63ae4ea0/1709913181297/意识形态的崇高客体.（斯洛文尼亚）斯拉沃热·齐泽克著.扫描版.pdf"
              target="_blank"
              rel="noopener noreferrer"
              >意识形态的崇高客体.（斯洛文尼亚）斯拉沃热·齐泽克著.扫描版.pdf</a
            >
          </li>
          <li>
            <a
              href="https://fs-im-kefu.7moor-fs1.com/29397395/4d2c3f00-7d4c-11e5-af15-41bf63ae4ea0/1709917328428/利兹与青鸟 公式.pdf"
              target="_blank"
              rel="noopener noreferrer"
              >利兹与青鸟 公式.pdf</a
            >
          </li>
        </ul>
        <span>语言学：</span>
        <ul>
          <li>
            <a
              href="https://fs-im-kefu.7moor-fs1.com/29397395/4d2c3f00-7d4c-11e5-af15-41bf63ae4ea0/1709915947229/《论语言的起源》（德·赫尔德）.pdf"
              target="_blank"
              rel="noopener noreferrer"
              >《论语言的起源》（德·赫尔德）.pdf</a
            >
          </li>
          <li>
            <a
              href="https://fs-im-kefu.7moor-fs1.com/29397395/4d2c3f00-7d4c-11e5-af15-41bf63ae4ea0/1709915947386/E0303普通语言学教程.pdf"
              target="_blank"
              rel="noopener noreferrer"
              >E0303普通语言学教程.pdf</a
            >
          </li>
          <li>
            <a
              href="https://fs-im-kefu.7moor-fs1.com/29397395/4d2c3f00-7d4c-11e5-af15-41bf63ae4ea0/1709915947535/现代语言学词典.pdf"
              target="_blank"
              rel="noopener noreferrer"
              >现代语言学词典.pdf</a
            >
          </li>
          <li>
            <a
              href="https://fs-im-kefu.7moor-fs1.com/29397395/4d2c3f00-7d4c-11e5-af15-41bf63ae4ea0/1709915947876/语言学概论(邢福义).pdf"
              target="_blank"
              rel="noopener noreferrer"
              >语言学概论(邢福义).pdf</a
            >
          </li>
          <li>
            <a
              href="https://fs-im-kefu.7moor-fs1.com/29397395/4d2c3f00-7d4c-11e5-af15-41bf63ae4ea0/1709915959918/语言学名词.pdf"
              target="_blank"
              rel="noopener noreferrer"
              >语言学名词.pdf</a
            >
          </li>
          <li>
            <a
              href="https://fs-im-kefu.7moor-fs1.com/29397395/4d2c3f00-7d4c-11e5-af15-41bf63ae4ea0/1709915957707/语言学纲要_叶蜚声_2010修订版.pdf"
              target="_blank"
              rel="noopener noreferrer"
              >语言学纲要_叶蜚声_2010修订版.pdf</a
            >
          </li>
          <li>
            <a
              href="https://fs-im-kefu.7moor-fs1.com/29397395/4d2c3f00-7d4c-11e5-af15-41bf63ae4ea0/1709915947701/语言、演化与大脑(王士元).pdf"
              target="_blank"
              rel="noopener noreferrer"
              >语言、演化与大脑(王士元).pdf</a
            >
          </li>
          <li>
            <a
              href="https://fs-im-kefu.7moor-fs1.com/29397395/4d2c3f00-7d4c-11e5-af15-41bf63ae4ea0/1709915948828/语言学概论-第3版(叶宝奎).pdf"
              target="_blank"
              rel="noopener noreferrer"
              >语言学概论-第3版(叶宝奎).pdf</a
            >
          </li>
        </ul>
        <span>语言学-语音学：</span>
        <ul>
          <li>
            <a
              href="https://fs-im-kefu.7moor-fs1.com/29397395/4d2c3f00-7d4c-11e5-af15-41bf63ae4ea0/1709916557727/扩展国际音标.pdf"
              target="_blank"
              rel="noopener noreferrer"
              >扩展国际音标.pdf</a
            >
          </li>
          <li>
            <a
              href="https://fs-im-kefu.7moor-fs1.com/29397395/4d2c3f00-7d4c-11e5-af15-41bf63ae4ea0/1709916557898/Grounding stop place systems in the perceptuo-motor substance of speech On the universality of the labial–coronal–velar stop series.pdf"
              target="_blank"
              rel="noopener noreferrer"
              >Grounding stop place systems in the perceptuo-motor substance of speech
              On the universality of the labial–coronal–velar stop series.pdf</a
            >
          </li>
          <li>
            <a
              href="https://fs-im-kefu.7moor-fs1.com/29397395/4d2c3f00-7d4c-11e5-af15-41bf63ae4ea0/1709916558253/国际音标字母表（2016修订版）.pdf"
              target="_blank"
              rel="noopener noreferrer"
              >国际音标字母表（2016修订版）.pdf</a
            >
          </li>
          <li>
            <a
              href="https://fs-im-kefu.7moor-fs1.com/29397395/4d2c3f00-7d4c-11e5-af15-41bf63ae4ea0/1709916558090/发音语音学_罗安源著_北京：中央民族大学出版社_2005.06_249_11496563.pdf"
              target="_blank"
              rel="noopener noreferrer"
              >发音语音学_罗安源著_北京：中央民族大学出版社_2005.06_249_11496563.pdf</a
            >
          </li>
          <li>
            <a
              href="https://fs-im-kefu.7moor-fs1.com/29397395/4d2c3f00-7d4c-11e5-af15-41bf63ae4ea0/1709916558424/简明实用语音学.pdf"
              target="_blank"
              rel="noopener noreferrer"
              >简明实用语音学.pdf</a
            >
          </li>
          <li>
            <a
              href="https://fs-im-kefu.7moor-fs1.com/29397395/4d2c3f00-7d4c-11e5-af15-41bf63ae4ea0/1709916559321/周殿福：《国际音标自学手册》 [商务印书馆 1985].pdf"
              target="_blank"
              rel="noopener noreferrer"
              >周殿福：《国际音标自学手册》 [商务印书馆 1985].pdf</a
            >
          </li>
          <li>
            <a
              href="https://fs-im-kefu.7moor-fs1.com/29397395/4d2c3f00-7d4c-11e5-af15-41bf63ae4ea0/1709916559125/阅·音系学基础.pdf"
              target="_blank"
              rel="noopener noreferrer"
              >阅·音系学基础.pdf</a
            >
          </li>
          <li>
            <a
              href="https://fs-im-kefu.7moor-fs1.com/29397395/4d2c3f00-7d4c-11e5-af15-41bf63ae4ea0/1709916559858/朱晓农：《语音学》[商务印书馆 2010].pdf"
              target="_blank"
              rel="noopener noreferrer"
              >朱晓农：《语音学》[商务印书馆 2010].pdf</a
            >
          </li>
          <li>
            <a
              href="https://fs-im-kefu.7moor-fs1.com/29397395/4d2c3f00-7d4c-11e5-af15-41bf63ae4ea0/1709916558687/語音學教程（第五版）.pdf"
              target="_blank"
              rel="noopener noreferrer"
              >語音學教程（第五版）.pdf</a
            >
          </li>
        </ul>
        <span>语言学-语法学：</span>
        <ul>
          <li>
            <a
              href="https://fs-im-kefu.7moor-fs1.com/29397395/4d2c3f00-7d4c-11e5-af15-41bf63ae4ea0/1709916697123/Glossing-Rules.pdf"
              target="_blank"
              rel="noopener noreferrer"
              >Glossing-Rules.pdf</a
            >
          </li>
          <li>
            <a
              href="https://fs-im-kefu.7moor-fs1.com/29397395/4d2c3f00-7d4c-11e5-af15-41bf63ae4ea0/1709916696776/乔姆斯基《句法结构》.pdf"
              target="_blank"
              rel="noopener noreferrer"
              >乔姆斯基《句法结构》.pdf</a
            >
          </li>
          <li>
            <a
              href="https://fs-im-kefu.7moor-fs1.com/29397395/4d2c3f00-7d4c-11e5-af15-41bf63ae4ea0/1709916696955/（刘丹青）语法调查研究手册.PDF"
              target="_blank"
              rel="noopener noreferrer"
              >（刘丹青）语法调查研究手册.PDF</a
            >
          </li>
          <li>
            <a
              href="https://fs-im-kefu.7moor-fs1.com/29397395/4d2c3f00-7d4c-11e5-af15-41bf63ae4ea0/1709916696621/复综语：形态复杂的极端.pdf"
              target="_blank"
              rel="noopener noreferrer"
              >复综语：形态复杂的极端.pdf</a
            >
          </li>
        </ul>
        <span>语言学-语义学&语用学：</span>
        <ul>
          <li>
            <a
              href="https://fs-im-kefu.7moor-fs1.com/29397395/4d2c3f00-7d4c-11e5-af15-41bf63ae4ea0/1709916850287/符号学入门.pdf"
              target="_blank"
              rel="noopener noreferrer"
              >符号学入门.pdf</a
            >
          </li>
          <li>
            <a
              href="https://fs-im-kefu.7moor-fs1.com/29397395/4d2c3f00-7d4c-11e5-af15-41bf63ae4ea0/1709916850470/李天命 语理分析的思考方法.pdf"
              target="_blank"
              rel="noopener noreferrer"
              >李天命 语理分析的思考方法.pdf</a
            >
          </li>
          <li>
            <a
              href="https://fs-im-kefu.7moor-fs1.com/29397395/4d2c3f00-7d4c-11e5-af15-41bf63ae4ea0/1709916850811/索振羽-语用学教程.pdf"
              target="_blank"
              rel="noopener noreferrer"
              >索振羽-语用学教程.pdf</a
            >
          </li>
          <li>
            <a
              href="https://fs-im-kefu.7moor-fs1.com/29397395/4d2c3f00-7d4c-11e5-af15-41bf63ae4ea0/1709916850647/理论符号学导论.李幼蒸.pdf"
              target="_blank"
              rel="noopener noreferrer"
              >理论符号学导论.李幼蒸.pdf</a
            >
          </li>
        </ul>
      </ul>
      `,
          events: "<h2>活动日历</h2><p>哈三中哲学社团为C周社团，遵循哈三中社团联合会安排进行社团活动。</p><i>目前没有计划中的校外活动。</i>",
          contact:
            "<h2>联系方式</h2><p>有任何问题或建议，请通过以下方式联系我们：</p><ul><li>邮箱：<br/>wsgtc2333@dingtalk.com<br/>srirzo_o@outlook.com</li><li>微信：<br/>wxid_r37zwszq52ju22<br/>NZTO_o</li></ul>",
        };

        document.getElementById("main-content").innerHTML =
          contentMap[contentId] || "<h2>页面未找到</h2>";
      }

