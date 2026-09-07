const pair = (en, zh, tag = 'p', cls = '') => `<${tag} class="${cls}"><span class="en" lang="en">${en}</span><span class="zh" lang="zh-CN">${zh}</span></${tag}>`;

const stages = [
  {name:'Anchor',zh:'锚定',question:['Whose uncertainty are we reducing?','我们在为谁减少哪一种不确定？'],artifact:['An intent brief','一页体验意图'],detail:['Name the person, the task, the desired change and the evidence we still need.','明确使用者、任务、期待的变化，以及仍需验证的证据。'],check:['A real user. A meaningful next step. A clear owner.','有具体用户、有意义的下一步，也有明确的负责人。']},
  {name:'Understand',zh:'理解',question:['What is getting in the way?','是什么阻碍了用户？'],artifact:['A user & task evidence map','用户与任务证据图'],detail:['Observe real work. Separate what we know from what we assume.','观察真实任务，区分已知事实与待验证的假设。'],check:['Can the problem be described and tested in a real context?','能否在真实情境中描述并验证这个问题？']},
  {name:'Map',zh:'描绘',question:['Where does understanding break down?','理解在哪个环节中断？'],artifact:['A journey & opportunity map','旅程与机会地图'],detail:['Follow the task across discovery, setup, first value, everyday use and support.','沿着发现、设置、首次价值、日常使用与支持，追踪完整任务。'],check:['Choose the moment that matters to the user.','优先解决真正影响用户的关键时刻。']},
  {name:'Frame',zh:'定义',question:['What should this experience make possible?','这段体验应该让什么成为可能？'],artifact:['An experience thesis','一句体验命题'],detail:['Connect a useful promise with a credible mechanism and a meaningful action.','用可信的机制，将有用的承诺连接到有意义的行动。'],check:['Useful. Credible. Distinctive. Human. Sustainable.','有用、可信、独特、有感、可持续。']},
  {name:'Orchestrate',zh:'编排',question:['How does one touchpoint prepare the next?','一个触点如何为下一个做好准备？'],artifact:['A service & interaction blueprint','服务与交互蓝图'],detail:['Align the interface, the people, the information and the recovery path.','让界面、人员、信息与异常恢复路径彼此衔接。'],check:['Context survives each handoff, including when something fails.','每一次交接都保留上下文，也覆盖异常情况。']},
  {name:'Deliver',zh:'交付',question:['Can a person actually complete the task?','用户真的能完成任务吗？'],artifact:['An experience release plan','体验发布计划'],detail:['Prepare the product, guidance, language, support and feedback together.','让产品、指引、语言、支持与反馈机制一同就绪。'],check:['The core path works. Claims are supported. Recovery is possible.','关键路径可完成，主张有依据，异常可恢复。']},
  {name:'Learn',zh:'学习',question:['What did people understand—and do next?','用户理解了什么，又采取了什么行动？'],artifact:['A learning record','学习记录'],detail:['Compare observations with the original hypothesis. Feed the result back into the system.','将观察与原始假设对照，把结果反馈到整个系统。'],check:['Make an explicit decision: scale, iterate, hold or stop.','作出明确决策：扩大、迭代、暂缓或停止。']}
];

const loop = `<div class="understanding-loop" data-understanding-loop>
  <div class="loop-selectors" aria-label="Understanding Loop · 理解循环">${stages.map((s,i)=>`<button class="loop-selector" type="button" id="loop-tab-${i}" aria-controls="loop-panel-${i}" data-loop-step="${i}"><span class="loop-number">0${i+1}</span><span class="en" lang="en">${s.name}</span><span class="zh" lang="zh-CN">${s.zh}</span></button>`).join('')}</div>
  <div class="loop-panels">${stages.map((s,i)=>`<section class="loop-panel" id="loop-panel-${i}" aria-labelledby="loop-tab-${i}" data-loop-panel="${i}"><div class="loop-question"><span class="eyebrow">0${i+1} / 07 · ${s.name}</span>${pair(...s.question,'h3')}</div><div class="loop-evidence"><div>${pair('The output','产物','p','eyebrow')}${pair(...s.artifact,'h4')}${pair(...s.detail)}</div><div class="loop-check">${pair('The checkpoint','检查点','p','eyebrow')}${pair(...s.check)}</div></div></section>`).join('')}</div>
  ${pair('Seven stages. One learning loop. Move between them as the evidence changes.','七个阶段，一个学习闭环。随着证据变化，随时回到需要重新思考的阶段。','p','caption')}
</div>`;

export const pages = [
  {
    slug: 'experience', title: 'Experience · 体验系统', chapter: '05',
    body: `<div class="experience-page">
      <section class="chapter-intro experience-intro">
        ${pair('05 / Experience system','体验系统','p','eyebrow')}
        ${pair('From a number.<br>To a next step.','从一个数字，到下一步行动。','h1','display')}
        ${pair('An experience should leave you with a clearer understanding—and the confidence to act.','一次好的体验，应该让你理解得更清楚，也更有信心采取行动。','p','lede')}
        <div class="experience-compass" aria-label="See, understand, act, learn · 看见、理解、行动、学习">
          ${['See|看见','Understand|理解','Act|行动','Learn|学习'].map((x,i)=>`<div><span class="compass-dot" aria-hidden="true"></span><span class="caption">0${i+1}</span>${pair(...x.split('|'),'p')}</div>`).join('')}
        </div>
        ${pair('Experience direction · Working proposal','体验方向 · 前瞻提案','p','caption')}
      </section>

      <section class="section experience-chain-section">
        <div class="section-heading">${pair('01 / Continuity','连续性','p','eyebrow')}${pair('One task.<br>Across every touchpoint.','同一个任务，贯穿每一个触点。','h2')}</div>
        ${pair('A measurement becomes more useful when its context travels with it.','当上下文被保留，测量才更有用。','p','lede')}
        <ol class="experience-chain">
          <li><span class="chain-marker" aria-hidden="true">01</span>${pair('Device','设备','h3')}${pair('Make the invisible observable.','让不可见的状态变得可观察。')}<div class="chain-token">${pair('A measurement + its conditions','一次测量 + 测量条件','span')}</div></li>
          <li><span class="chain-marker" aria-hidden="true">02</span>${pair('Software','软件','h3')}${pair('Put the reading in context.','把读数放回具体情境。')}<div class="chain-token">${pair('A session + its history','一次任务 + 历史记录','span')}</div></li>
          <li><span class="chain-marker" aria-hidden="true">03</span>${pair('Knowledge','知识','h3')}${pair('Turn a difference into a question.','将差异转化为值得探索的问题。')}<div class="chain-token">${pair('An explanation + a next step','一种解释 + 下一步行动','span')}</div></li>
          <li><span class="chain-marker" aria-hidden="true">04</span>${pair('Service','服务','h3')}${pair('Keep understanding moving.','让理解继续发生。')}<div class="chain-token">${pair('Shared context + a recovery path','共享上下文 + 恢复路径','span')}</div></li>
        </ol>
        ${pair('Illustrative journey · A design direction, not a statement of current product integrations.','体验链路示意 · 表达设计方向，不代表当前产品已实现这些集成。','p','caption')}
      </section>

      <section class="section experience-loop-section">
        <div class="section-heading">${pair('02 / Understanding Loop','理解循环','p','eyebrow')}${pair('Design the path<br>to understanding.','设计通往理解的路径。','h2')}</div>
        ${pair('Select a stage to explore its question, output and checkpoint.','选择一个阶段，查看它要回答的问题、产物与检查点。','p','lede')}
        ${loop}
      </section>

      <section class="section experience-principles">
        <div class="section-heading">${pair('03 / Interface DNA','界面基因','p','eyebrow')}${pair('The interface<br>serves the judgment.','界面服务于判断。','h2')}</div>
        <div class="grid-3">
          <article class="panel">${pair('Show the state.','状态清晰。','h3')}${pair('Make source, context and limits visible where the decision happens.','在用户作出决定的地方，呈现来源、情境与限制。')}</article>
          <article class="panel">${pair('Suggest a next step.','行动明确。','h3')}${pair('Explain what a signal can help someone explore next.','说明一个信号能帮助用户继续探索什么。')}</article>
          <article class="panel">${pair('Leave room for taste.','保留感官判断。','h3')}${pair('Data supports experience. The person remains the judge.','数据支持经验，判断仍由人作出。')}</article>
        </div>
        ${pair('Data is a clue.<br>Understanding is the value.','数据是线索，理解才是价值。','p','assertion')}
      </section>
    </div>`
  },
  {
    slug: 'future', title: 'Long view · 长期运营', chapter: '06',
    body: `<div class="future-page">
      <section class="chapter-intro future-intro">
        ${pair('06 / The long view','长期视角','p','eyebrow')}
        ${pair('A living system.<br>A longer horizon.','持续演进的系统，面向更长的未来。','h1','display')}
        ${pair('Build a shared foundation. Try it in the real world. Keep what helps people understand.','建立共同基础，在真实世界试用，保留真正帮助人们理解的部分。','p','lede')}
        <div class="proposal-notice">${pair('Working proposal','前瞻提案','p','tag')}${pair('A proposed operating rhythm for the brand and experience system. Timings are planning windows, not a launch commitment or an approved company policy.','以下为品牌与体验系统的运营节奏建议。时间表示规划窗口，不构成上市承诺或已批准的公司制度。','p','caption')}</div>
      </section>

      <section class="section future-baseline">
        <div class="section-heading">${pair('01 / Establish the baseline','建立基线','p','eyebrow')}${pair('14 working days.<br>One shared foundation.','14 个工作日，建立共同基础。','h2')}</div>
        <div class="future-phases">
          <article><span class="phase-range">01—02</span>${pair('Decide the essentials.','明确核心选择。','h3')}${pair('Document the brand story and the essential visual rules.','记录品牌叙事与关键视觉规则。')}</article>
          <article><span class="phase-range">03—05</span>${pair('Make the story usable.','让叙事可被使用。','h3')}${pair('Build a company introduction that can be reviewed as a complete story.','形成叙事完整、可供评审的公司介绍。')}</article>
          <article><span class="phase-range">06—10</span>${pair('Turn rules into tools.','把规则变成工具。','h3')}${pair('Translate the baseline into guidelines and foundational UI components.','将基线转化为应用指南与基础 UI 组件。')}</article>
          <article><span class="phase-range">11—14</span>${pair('Prove it in application.','在应用中检验。','h3')}${pair('Apply the system to a product sheet, check consistency and prepare the handoff.','用产品资料页验证系统，检查一致性并完成交接。')}</article>
        </div>
        ${pair('A reusable baseline is the first milestone. Real-world use is the next test.','可复用的基线是第一个里程碑，真实使用是下一次检验。','p','caption')}
      </section>

      <section class="section future-pilot">
        <div class="split"><div><span class="pilot-range" aria-label="6 to 10 weeks">6–10</span>${pair('weeks / pilot window','周 / 建议试点周期','p','eyebrow')}</div><div><div class="section-heading">${pair('02 / Start with one journey','从一条旅程开始','p','eyebrow')}${pair('Small enough to learn.<br>Real enough to matter.','小到足以学习，真实到有意义。','h2')}</div>${pair('Choose a bounded journey—from understanding a product to reaching its first useful result. Connect device or software, guidance and service around the same task.','选择一条范围明确的旅程：从理解产品，到首次获得有用的结果。让设备或软件、指引与服务围绕同一个任务衔接。','p','lede')}</div></div>
        <div class="grid-3 pilot-criteria"><article class="panel">${pair('Before the pilot','试点之前','h3')}${pair('Record the baseline, the hypothesis and what would make us stop.','记录基线、假设与停止条件。')}</article><article class="panel">${pair('During the pilot','试点之中','h3')}${pair('Observe real tasks. Capture confusion as carefully as success.','观察真实任务，同样认真地记录困惑与成功。')}</article><article class="panel">${pair('After the pilot','试点之后','h3')}${pair('Decide what to change, what to reuse and what to retire.','决定修改什么、复用什么，以及停止什么。')}</article></div>
      </section>

      <section class="section future-review">
        <div class="section-heading">${pair('03 / A rhythm for learning','学习的节奏','p','eyebrow')}${pair('A release is<br>a beginning.','发布，是一个开始。','h2')}</div>
        ${pair('T is the pilot release date; +14 and +45 mean days after release. Each review should end with a decision.','T 指试点发布日期；+14 与 +45 分别指发布后 14 天与 45 天。每一次复盘，都应该形成一个决策。','p','lede')}
        <ol class="review-timeline">
          <li><span class="review-time">T+14</span><div>${pair('Does it make sense?','用户理解了吗？','h3')}${pair('Review confusion, broken paths and early actions. Resolve the obstacles to first value.','检查理解偏差、路径故障与早期行动，解决首次获得价值的障碍。')}</div></li>
          <li><span class="review-time">T+45</span><div>${pair('Does it keep helping?','它持续有用吗？','h3')}${pair('Review adoption, repeated use and continuity across touchpoints.','检查采用、持续使用与跨触点的连续性。')}</div></li>
          <li><span class="review-time"><span class="en" lang="en">Quarterly</span><span class="zh" lang="zh-CN">每季度</span></span><div>${pair('What should evolve?','什么应该继续演进？','h3')}${pair('Scale, iterate, hold or stop. Update the standards and knowledge that the next team will use.','扩大、迭代、暂缓或停止，并更新下一次工作要使用的标准与知识。')}</div></li>
        </ol>
      </section>

      <section class="section future-measure">
        <div class="section-heading">${pair('04 / Define before measuring','先定义，再衡量','p','eyebrow')}${pair('Measure understanding.<br>Then what it enables.','衡量理解，以及理解带来的改变。','h2')}</div>
        ${pair('Proposed measures, not reported results. Establish a baseline before setting targets.','以下是建议指标，并非已取得的成果。先建立基线，再设定目标。','p','lede')}
        <div class="grid-2 metric-definitions">
          <details class="panel" open><summary>${pair('Understanding','理解','span')}<span class="metric-toggle" aria-hidden="true">+</span></summary><div>${pair('Explanation accuracy','复述正确率','h3')}${pair('The share of participants who correctly explain the meaning and limits of a result in a defined task.','在指定任务中，能够正确解释结果含义与适用限制的参与者比例。')}${pair('Use a consistent prompt and a documented scoring rubric.','使用一致的问题与明确的评分标准。','p','caption')}</div></details>
          <details class="panel" open><summary>${pair('Action','行动','span')}<span class="metric-toggle" aria-hidden="true">+</span></summary><div>${pair('Task success','任务成功率','h3')}${pair('The share of task attempts completed against predefined success criteria.','满足预先定义成功标准的任务尝试，占全部任务尝试的比例。')}${pair('Define the task, participants and allowed assistance before testing.','测试前明确任务、参与者与允许的协助程度。','p','caption')}</div></details>
          <details class="panel" open><summary>${pair('Continuity','连续性','span')}<span class="metric-toggle" aria-hidden="true">+</span></summary><div>${pair('Handoff completion','交接完成率','h3')}${pair('The share of observed touchpoint transitions that preserve the context required for the next step.','在观察到的触点交接中，保留了下一步所需上下文的交接比例。')}${pair('Specify the required context for each transition in advance.','提前定义每一次交接必须保留的上下文。','p','caption')}</div></details>
          <details class="panel" open><summary>${pair('System health','系统健康','span')}<span class="metric-toggle" aria-hidden="true">+</span></summary><div>${pair('Release readiness','发布就绪率','h3')}${pair('The share of required readiness checks that pass before a scoped release.','在指定发布范围内，发布前通过的必需就绪检查占比。')}${pair('Keep critical failures visible; an average must not hide a blocked path.','单独呈现关键失败项，避免平均值掩盖无法完成的路径。','p','caption')}</div></details>
        </div>
        ${pair('A brand becomes stronger<br>with every useful lesson.','每一次有用的学习，都让品牌更有力量。','p','assertion')}
      </section>
    </div>`
  }
];

export const css = `
.experience-page .en,.future-page .en{display:block}.experience-page .zh,.future-page .zh{display:block;margin-top:.45em}
.experience-compass{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));margin-top:clamp(3rem,8vw,7rem);padding-top:1.5rem;border-top:1px solid #454c51;gap:1.5rem}
.experience-compass>div{position:relative}.compass-dot{width:7px;height:7px;display:block;border-radius:50%;background:#5ECDBD;position:absolute;top:calc(-1.5rem - 4px);left:0}.experience-compass p{font-size:clamp(1rem,2vw,1.5rem)}
.experience-chain{list-style:none;padding:0;display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:0;margin:3.5rem 0 1.5rem}.experience-chain>li{border-top:1px solid #5b676f;padding:1.5rem 1.5rem 0 0;position:relative;min-width:0}.chain-marker{display:inline-grid;place-items:center;width:2.25rem;height:2.25rem;border:1px solid #5b676f;border-radius:50%;margin-bottom:1.5rem;font:12px ui-monospace,monospace;background:#0A0D10}.experience-chain h3{font-size:clamp(1.4rem,2vw,2rem);margin:.2rem 0 1rem}.chain-token{border-left:2px solid #5ECDBD;padding-left:1rem;margin-top:2rem;font-size:.8rem;color:#aeb8c0}.chain-token .zh{font-size:.95em}
.understanding-loop{margin-top:3rem}.loop-selectors{display:grid;grid-template-columns:repeat(7,minmax(0,1fr));gap:.45rem}.loop-selector{background:transparent;color:#d7dce0;border:1px solid #454c51;padding:1rem .7rem;text-align:left;cursor:pointer;min-width:0;font:inherit}.loop-selector .en{font-size:clamp(.7rem,1.2vw,.95rem)}.loop-selector .zh{font-size:.75rem}.loop-selector[aria-selected=true]{background:#1b2527;border-color:#5ECDBD;color:#F3F4F5}.loop-selector[aria-selected=true] .loop-number{color:#5ECDBD}.loop-number{display:block;font:.7rem ui-monospace,monospace;margin-bottom:1.8rem;color:#a5afb7}.loop-selector:focus-visible,.metric-definitions summary:focus-visible{outline:2px solid #5ECDBD;outline-offset:4px}
.loop-panel{margin-top:1rem;padding:clamp(1.5rem,4vw,4rem);background:#15191D;border:1px solid #303940;display:grid;grid-template-columns:1.1fr 1fr;gap:clamp(2rem,5vw,5rem);min-height:350px}.loop-panel[hidden]{display:none}.loop-question h3{font-size:clamp(1.6rem,3vw,3rem);line-height:1.18;margin:2rem 0}.loop-question h3 .zh{font-size:.5em;line-height:1.7}.loop-evidence h4{font-size:1.1rem;margin:1rem 0}.loop-evidence h4 .zh{font-size:.8em}.loop-evidence p:not(.eyebrow){font-size:.95rem;line-height:1.6}.loop-check{border-top:1px solid #38424a;margin-top:1.7rem;padding-top:1rem}.loop-check .eyebrow{color:#5ECDBD}.experience-principles .panel h3{font-size:clamp(1.4rem,2vw,2rem)}
.proposal-notice{max-width:650px;border-left:2px solid #5ECDBD;padding-left:1.3rem;margin-top:3rem}.proposal-notice .tag{margin:0 0 1rem}.future-phases{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:1.75rem;margin-top:3.5rem}.future-phases article{border-top:1px solid #454c51;padding-top:1rem;min-width:0}.phase-range{display:block;font:clamp(2.2rem,5vw,4.5rem) ui-monospace,monospace;letter-spacing:-.06em;margin:1rem 0 2.5rem;color:#5ECDBD}.future-phases h3{font-size:1.4rem;line-height:1.3}.future-phases h3 .zh{font-size:.65em}.future-phases p{font-size:.95rem;line-height:1.6}.pilot-range{display:block;font-size:clamp(5rem,15vw,13rem);line-height:1;font-weight:500;letter-spacing:-.09em;color:#5ECDBD}.future-pilot .split{align-items:center;gap:3rem}.pilot-criteria{margin-top:4rem}.review-timeline{list-style:none;padding:0;margin-top:3rem}.review-timeline>li{border-top:1px solid #454c51;padding:2rem 0;display:grid;grid-template-columns:minmax(140px,.6fr) 1.4fr;gap:3rem}.review-time{font-size:clamp(1.8rem,4.5vw,4rem);letter-spacing:-.04em;font-weight:500}.review-time .zh{font-size:.3em;letter-spacing:0}.review-timeline h3{font-size:clamp(1.3rem,2.5vw,2rem);margin:0 0 1rem}.review-timeline h3 .zh{font-size:.55em}.review-timeline p{max-width:650px}.metric-definitions{margin-top:3rem}.metric-definitions details{padding:0;min-width:0}.metric-definitions summary{cursor:pointer;display:flex;justify-content:space-between;align-items:center;padding:1.5rem;gap:1rem;list-style:none}.metric-definitions summary::-webkit-details-marker{display:none}.metric-definitions summary>span:first-child{font-size:1.2rem}.metric-definitions summary .zh{font-size:.7em}.metric-definitions details>div{padding:0 1.5rem 1.5rem}.metric-definitions h3{font-size:1rem;margin:1rem 0}.metric-definitions h3 .zh{font-size:.8em}.metric-definitions p{font-size:.95rem;line-height:1.6}.metric-toggle{font-size:1.8rem;color:#5ECDBD;line-height:1;transition:transform .2s}.metric-definitions details[open] .metric-toggle{transform:rotate(45deg)}
@media(max-width:900px){.experience-chain,.future-phases{grid-template-columns:repeat(2,minmax(0,1fr));row-gap:2.5rem}.loop-selectors{grid-template-columns:repeat(4,minmax(0,1fr))}.loop-selector .en{font-size:.9rem}.loop-number{margin-bottom:1rem}.loop-panel{grid-template-columns:1fr;gap:1rem}.loop-question h3{margin:1.5rem 0}.loop-question h3 .zh{font-size:.55em}}
@media(max-width:560px){.experience-compass{grid-template-columns:repeat(2,minmax(0,1fr));row-gap:2rem}.experience-compass>div:nth-child(n+3) .compass-dot{top:-.65rem}.experience-chain,.future-phases{grid-template-columns:1fr}.experience-chain>li{padding-right:0}.chain-token{margin-top:1.25rem}.loop-selectors{grid-template-columns:repeat(2,minmax(0,1fr))}.loop-selector{padding:.8rem}.loop-selector:last-child{grid-column:1/-1}.loop-number{margin-bottom:.6rem}.review-timeline>li{grid-template-columns:1fr;gap:1rem}.future-pilot .split{gap:2rem}.phase-range{margin-bottom:1.5rem}.metric-definitions summary,.metric-definitions details>div{padding-left:1.1rem;padding-right:1.1rem}}
@media(prefers-reduced-motion:reduce){.metric-toggle{transition:none}}
`;
