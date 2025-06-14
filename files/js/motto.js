// 随机格言数组
const mottos = [
        "认识你自己",
        "我思故我在",
        "唯有知识可以自由",
        "生活未经反思不值得过",
        "存在即是被感知",
        "人是一切的尺度",
        "如果你因失去了太阳而流泪，那么你也将失去群星了。",
        "不要因为峭壁是高的，便让你的爱情坐在峭壁上。",
        "那些把灯背在背上的人，把他们的影子投到了自己前面。",
        "休息与工作的关系，正如眼睑与眼睛的关系。",
        "人是一个初生的孩子，他的力量，就是生长的力量。",
        "不要因为你自己没有胃口而去责备你的食物。",
        "群星不怕显得像萤火那样。",
        "当我们大为谦卑的时候，便是我们最接近伟大的时候。",
        "谢谢火焰给你光明，但是不要忘了那执灯的人，他是坚忍地站在黑暗当中呢。",
        "瀑布歌唱道：“虽然渴者只要少许的水便够了，我却很快活地给予了我的全部的水。”",
        "樵夫的斧头，问树要斧柄。树便给了他。",
        "我们把世界看错了，反说它欺骗我们。",
        "人对他自己建筑起堤防来。",
        "使生如夏花之绚烂，死如秋叶之静美。",
        "露点对湖水说道：“你是在荷叶下面的大露点，我是在荷叶上面的较小的露点。”",
        "尘土受到损辱，却以她的花朵来报答。",
        "根是地下的枝。枝是空中的根。",
        "梦是一个一定要谈话的妻子。睡眠是一个默默忍受的丈夫。",
        "鸟以为把鱼举在空中是一种慈善的举动。",
        "不是槌的打击，乃是水的载歌载舞，使鹅卵石臻于完美。",
        "时间是变化的财富。时钟模仿它，却只有变化而无财富。",
        "大的不怕与小的同游。居中的却远而避之。",
        "夜秘密地把花开放了，却让那白日去领受谢词。",
        "萤火对天上的星说道：“学者说你的光明总有一天会消灭的。”天上的星不回答它。",
        "沟洫总喜欢想：河流的存在，是专为它供给水流的。",
        "太急于做好事的人，反而找不到时间去做好人。",
        "脚趾乃是舍弃了其过去的手指。",
        "弓在箭要射出之前，低声对箭说道：“你的自由就是我的自由。”",
        "全是理智的心，恰如一柄全是锋刃的刀。它叫使用它的人手上流血。",
        "鸟翼上系上了黄金，这鸟便永不能再在天上翱翔了。",
        "不要让刀锋讥笑它柄子的拙钝。",
        "死亡隶属于生命，正与生一样。",
        "举足是走路，正如落足也是走路。",
        "批判的武器当然不能代替武器的批判，物质力量只能用物质力量来摧毁；但是理论一经群众掌握，也会变成物质力量。",
        "人们为了能够“创造历史”，必须能够生活。但是为了生活，首先就需要吃喝住穿以及其他一些东西。",
        "人们自己创造自己的历史，但是他们并不是随心所欲地创造，并不是在他们自己选定的条件下创造，而是在直接碰到的、既定的、从过去承继下来的条件下创造。",
        "历史是这样创造的：最终的结果总是从许多单个的意志的相互冲突中产生出来的，而其中每一个意志，又是由于许多特殊的生活条件，才成为它所成为的那样。这样就有无数互相交错的力量，有无数个力的平行四边形，由此就产生出一个合力，即历史结果，而这个结果又可以看做一个作为整体的、不自觉地和不自主地起着作用的力量的产物。",
        "关于环境和教育起改变作用的唯物主义学说忘记了：环境正是由人来改变的，而教育者本人一定是受教育的。因此，这种学说必然把社会分成两部分，其中一部分凌驾于社会之上。环境的改变和人的活动或自我改变的一致，只能被看作是并合理地理解为革命的实践。",
        "人的本质并不是单个人所固有的抽象物。在其现实性上，它是一切社会关系的总和。",
        "如果我们选择了最能为人类福利而劳动的职业，那么，重担就不能把我们压倒，因为这是为大家而献身；那时我们所感到的就不是可怜的、有限的、自私的乐趣，我们的幸福将属于千百万人，我们的事业将默默地、但是永恒发挥作用地存在下去，而面对我们的骨灰，高尚的人们将洒下热泪。",
        "我们不要过分陶醉于我们人类对自然界的胜利。对于每一次这样的胜利，自然界都对我们进行报复。",
        "现在一切都在于实践，现在已经到了这样一个历史关头：理论在变为实践，理论由实践赋予活力，由实践来修正，由实践来检验；要知道，“我的朋友，理论是灰色的，但生活之树是常青的”。",
        "一切社会变迁和政治变革的终极原因,不因当在人们的头脑中,在人们对永恒的真理和正义的日益增进的认识中去寻找,而应当在生产方式和交换方式的变更中去寻找：不应当在有关的时代的哲学中去寻找,而应当在有关的时代的经济学中去寻找。",
        "一切民族都将走向社会主义，这是不可避免的，但是一切民族的走法却不会完全一样，在民主的这种或那种形式上，在无产阶级专政的这种或那种形态上，在社会生活各方面的社会主义改造的速度上，每个民族都会有自己的特点。",
        "你们认为公道和公平的东西，与问题毫无关系。问题就在于：一定的生产制度所必需的和不可避免的东西是什么?",
        "一切反动派都是纸老虎。",
        "战略上要轻视它，战术上要重视它。",
        "以斗争求团结则团结存，以退让求团结则团结亡。",
        "谁是我们的敌人？谁是我们的朋友？",
        "不要陷于狭隘的经验论。",
        "谅解、支援和友谊，比什么都重要。",
        "人民万岁！",
        "当伟大的革命家在世时，压迫阶级总是不断迫害他们，以最恶毒的敌意、最疯狂的仇恨、最放肆的造谣和诽谤对待他们的学说。在他们逝世以后，便试图把他们变为无害的神像，可以说是把他们偶像化，赋予他们的名字某种荣誉，以便“安慰”和愚弄被压迫阶级，同时却阉割革命学说的内容，磨去它的革命锋芒，把它庸俗化。",
        "凡是敌人反对的，我们就要拥护，凡是敌人拥护的，我们就要反对。",
        "没有调查就没有发言权。",
        "鸡蛋因适当的温度而变化为鸡，但温度不能使石头变为鸡。",
        "贪污和浪费是极大的犯罪。",
        "自时间之始我就从事烧烤，我还从来没有见过这样的鹅！",
        "愚蠢被误认为是命运之神犯下的罪过。",
        "劳动是人类的命运。",
        "追逐影子的人，自己就是影子。",
        "智慧的标志是审时度势之后再择机行事。",
        "温和的谈吐源于仁慈的人心。",
        "漫长的休息，痛苦有如痼疾。",
        "言近旨远，文简意明。",
        "决定问题，需要智慧，贯彻执行时则需要耐心。",
        "惟仁德才能永远屹立不摇。",
        "绣花针对铁梁，大小各有用场。",
        "人体是最神圣的东西。",
        "放弃时间的人，时间也放弃他。",
        "上帝能创造出祂自己搬不动的石头吗？",
        "历史无疑注定要重复自身：毕竟，历史如同人，没有很多选择。",
        "几乎在所有人类努力的领域都如此受欢迎的民主原则，在至少两个领域是用不上的：艺术和科学。在这两个领域应用民主原则，其结果将是把杰出与垃圾、发现与无知等同起来。",
        "恶无处不在，原因之一是它往往会以善的面目出现。",
        "精神健康的人,总是努力的工作及爱人,只要能做到这两件事,其它的事就没有什么困难。",
        "没有玩笑这回事，所有的玩笑都有认真的成分。没有口误这回事，所有的口误都是潜意识的真实的流露。",
        "良心是一种内心的感觉，是对于躁动于我们体内的某种异常愿望的抵制。",
        "对于成功的坚信不疑时常会导致真正的成功。",
        "人生就象弈棋， 一步失误， 全盘皆输，这是令人悲哀之事；而且人生还不如弈棋，不可能再来一局，也不能悔棋。",
        "任何宗教，即使是自称为博爱的宗教，对于那些不属于它的人们，也一定是冷酷无情的。",
        "没有一个没有理智的人，能够接受理智。",
        "梦的内容是由于意愿的形成，其目的在于满足意愿。",
        "梦是愿望的满足。",
        "我坚信人类文明是以牺牲原始的本能为代价而创造出来的。",
        "本我过去在哪里，自我就应在哪里。",
        "理智的声音是柔和的，但它在让人听见之前决不会停歇",
        "人类天生具有“弑父情结”，从一出生,他就注定要和父亲展开斗争，以摆脱被统治、被支配的地位，争取独立自由的权利，进而掌握家庭的主导权和社会的主动权。",
        "如果我们能把歇斯底里的痛苦转化为寻常的不愉快，收获就相当可观了。",
        "言辞具有不可思议的力量。他们能带来最大的幸福，也能带来最深的失望；能把知识从教师传给学生；言辞能使演说者左右他的听众，并强行代替他们作出决定。言辞能激起最强烈的情感，促进人的一切行动。",
        "我们整个心理活动似乎都是在下决心去求取欢乐，避免痛苦，而且自动地受唯乐原则的调节。",
        "人是一个受本能愿望支配的低能弱智的生物。",
        "凡人皆无法隐瞒私情，尽管他的嘴可以保持缄默，但他的手指却会多嘴多舌。",
        "你的眼睛疲倦了、累了、闭上你的眼睛。",
        "一种科学要对人类的知识有所贡献，也不必勉强人家信服。相信不相信，要看成绩，它可以耐心等待用自己的研究成果来引起大家的注意。",
        "人不是根本不相信自己的死，就是在无意识中确信自己不死。",
        "任何五官健全的人必定知道他不能保存秘密。如果他的嘴唇紧闭，他的指尖会说话，甚至他身上的每个毛孔都会背叛他。 ",
        "我们只所以不是响尾蛇有2个原因，第一我们父母都不是，第二我们不住在沙漠的中央。",
        "每个人都有一个本能的侵犯能量储存器，在储存器里，侵犯能量的总量是固定的，它总是要通过某种方式表现出来，从而使个人内部的侵犯性驱力减弱。",
        "幸福决不是文化的价值标准。",
        "我们不应该寻找英雄，我们应该寻找好的想法。语言不仅仅是文字。这是一种文化，一种传统，一个社区的统一，一个创造社区的整个历史。这一切都体现在一种语言中。",
        "事实是，如果你没有开发语言，你根本无法获得大部分人类经验，如果你无法获得经验，那么你将无法正确思考。",
        "发现是对简单事物感到困惑的能力。",
        "普通民众不知道发生了什么，甚至不知道自己不知道。",
        "人们自己如何看待他们正在做的事情并不是我感兴趣的问题。",
        "没有人会把真相灌进你的大脑。这是你必须自己去发现的东西。",
        "让人们保持被动和顺从的明智方法是严格限制可接受意见的范围，但允许在该范围内进行非常活跃的辩论。",
        "在人类生存的这个可能的终结阶段，民主和自由不仅仅是值得重视的理想——它们可能对生存至关重要。",
        "如果你没有冒犯应该被冒犯的人，那你就做错了。",
        "教育是一个强加无知的系统。",
        "如果某件事被一遍又一遍地重复，那么很可能它显然是错误的。",
        "你应对自己行为的可预测后果负责。",
        "如果我们选择，我们可以生活在一个令人欣慰的幻想世界中。",
        "如果你关心其他人，你可能会试图组织起来破坏权力和权威。如果你只关心自己，那是不会发生的。",
        "道可道，非常道。",
        "物壮则老。",
        "物极必反，盛极必衰。",
        "将欲翕之，必固张之。将欲弱之，必固强之。将欲废之，必固兴之。将欲夺之，必固与之。",
        "大方无隅，大器晚成，大音希声，大象无形。",
        "天下之至柔，驰骋于天下之至坚。",
        "以正治国，以奇用兵，以无事取天下。",
        "见小曰明，守柔曰强。",
        "祸兮福之所倚，福兮祸之所伏。",
        "任何形式的机构一旦成立都会把维持自身存在作为首要任务",
        "我警惕希腊人，即使在他们带着礼物的时候",
        "这样的哲学家之所以爱鞑靼人，是为了避免去爱他们的邻居。",
        "燃尽之后，除了灰烬，什么也不会剩下",
        "人类不只渴望超越与奇迹，他们对“平凡”“普通”的追求也远超我们想象",
        "在黎明到来之前，必须有人稍微照亮黑暗",
        "天之苍苍，其正色邪？其远而无所至极邪？其视下也，亦若是则已矣",
        "非丧心病狂者不入此门",
        "我渐渐明白，有很多人是揣着明白装糊涂，问题的答案并不能帮上他们的忙",
        "生命永远会有令人懊悔的事，但人是为了不留遗憾而活着人生最终的价值在于觉醒和思考的能力，而不只在于生存。",
        "放纵自己的欲望是最大的祸害,谈论别人的隐私是最大的罪恶,不知自己过失是最大的病痛。",
        "克服了恐惧的人才能获得真正的自由。",
        "时间碾碎万物；一切都因时间的力量而衰老，在时间的流逝中被遗忘。",
        "我认为，与战胜敌人的人相比，战胜欲望的人更加勇敢。教育是富人的装饰品，穷人的避难所。",
        "工作的目的便是获得空闲。",
        "对谁都是朋友，实质对谁都不是朋友。",
        "有七个原因决定了所有人类的行动：机遇、本性、强迫、习惯、理性、激情和欲望。",
        "羽毛相同的鸟，自会聚在一起。",
        "智慧不仅仅存在于知识之中，而且还存在于运用知识的能力中。",
        "吠犬之用，胜于睡狮。",
        "吾爱吾师，吾更爱真理。",
        "一个智者的目标不是追求幸福，而是尽其可能地避免不幸。",
        "坏人因畏惧而服从，好人因爱而服从。",
        "我们无法通过智力去影响别人，情感却能做到这一点。",
        "会成为什么样的人，全看重复做什么样的事。",
        "即使上帝也无法改变过去。",
        "语言的准确性，是优良风格的基础。",
        "在科学上进步而道义上落后的人，不是前进，而是后退。",
        "挚友如异体同心。",
        "善就是幸福，中庸是最高的善和极端的美。",
        "好感是友谊的先决条件，但不能把两者混为一谈。",
        "战争的目的必须是为了和平。",
        "事业是理念和实践的生动统一。",
        "严肃的人模仿高尚的人的行动，轻浮的人则模仿卑劣的人的行动。",
        "勇敢乃是自信与害怕中间之道。",
        "在不幸中，有用的朋友更为必要；在幸运中，高尚的朋友更为必要。在不幸中，寻找朋友出于必需；在幸运中，寻找朋友出于高尚。",
        "理性的人追求的不是快乐，而只是没有痛苦。",
        "谬误有多种多样，而正确却只有一种，这就是为什么失败容易成功难，脱靶容易中靶难缘故。",
        "把权力赋予人等于引狼入室，因为欲望具有兽性，纵然最优秀者，一旦大权在握，总倾向于被欲望的激情所腐蚀。",
        "诗人的职责不在于描述已发生的事，而在于描述可能发生的事。",
        "只有克服了自己的恐惧， 才可能获得真正的自由。",
        "当你被水噎住的时时候，你还能喝别的什么饮料把那口水送下去呢？",
        "人生最终的价值在觉醒和思考的能力，而不只在于生存。",
        "最明晰的风格是由普通语言形成的。",
        "放松与娱乐，被认为是生活中不可缺少的要素。",
        "自由是服从自定的规则。",
        "重复不停地去做一件工作，这个工作就会变成我们本身。到那时，杰出就不是一个动作，而是一种习惯了。",
        "任何人都会生气，这很简单，但选择正确的对象，把握正确的程度，在正确的时间，出于正确的目的，通过正确的方式生气，这却不简单。",
        "一切艺术、宗教都不过是自然的附属物。",
        "情感，是指嗜欲，忿怒，恐惧，自信，妒嫉，喜悦，友情，憎恨，渴望，好胜心，怜悯心，和一般伴随痛苦或快乐的各种感情。",
        "美是一种自然优势。",
        "法治比任何一个人的统治来得更好。所谓法治，应包含两重含义：已成立的法律获得普遍的服从，而大家做服从法律又本身是制定良好的法律。",
        "怜悯是一个人遭受厄运而引起的，恐惧是这个遭受厄运的人与我们相似而引起的。",
        "闲暇当然是一种幸福。",
        "德可以分为两种：一种是智慧的德，另一种是行为的德，前者是从学习中得来的，后者是从实践中得来的。",
        "遵照道德准则生活就是幸福的生活。",
        "气度宽宏的人，无论遭遇的命运为善为恶，皆能适度以应之。成功不以为喜，失败不以为悲，外界的毁誉褒贬，一不介怀，只是为所当为，为所可为而已。",
        "法律是没有激情的理性。",
        "凡善于考虑的人，一定是能根据其思考而追求可以通过行动取得最有益于人类东西的人。",
        "人类是天生社会性动物。",
        "一只燕子捎不来春天，一个晴日带不来生机。",
        "真正的美德不可没有实用的智慧，而实用的智慧也不可没有美德。",
        "人们为善的道路只有一条，作恶的道路可以有许多条。",
        "幸福在于自给自足之中。",
        "习惯实际上已成为天性的一部分。事实上，习惯有些像天性，因为“经常”和“总是”之间的差别是不大的，天性属于“总是”的范畴，而习惯则属于“经常”的范畴。",
        "对年轻人来说，朋友是提醒他们不犯错误的谋士；对老年人来说，朋友是补充他们衰竭的体力、照顾他们生活困难的助手；对成年人来说，朋友是辅佐他们完成宏伟事业的臂。",
        "事物在运动着的任何时候，总是一方面处在它所正在的状态下，另一方面又是在它变化所趋向的那个状态下。",
        "知识分子优于文盲，如同活人优于死人。",
        "热爱真理的人在没有危险时爱着真理，在危险时更爱真理。",
        "由于思想活动，理性才获其至善。",
        "有人问：写一首好诗，是靠天才呢？还是靠艺术？我的看法是：苦学而没有丰富的天才，有天才而没有训练，都归无用；两者应该相互为用，相互结合。",
        "人类需要的知识有三：理论，实用，鉴别。",
        "金钱的欲望就像一头贪婪无比的野兽，你永远不知道它脚下埋下了多少宝贵的青春，当青春耗尽，也许你什么也留不住，只留下了孤独和面目可憎。",
        "大自然的每一个领域都是美妙绝伦的。",
        "人在本质上是社会性的动物，那些生来就缺乏社会性的个体，要么是比别人低级，要么就是超人。社会实际上是先于个体而存在的。不能在社会中生活的个体，或者是因为自满足而无需参与社会生活的个体，不是兽类，就是天神。",
        "工作在无意间满足了人们,想要远离日益混乱的生活的需求。",
        "爱就是两个身体一个灵魂。",
        "上帝所做的、胜过一切想象中的幸福行为，莫过于纯粹的思考，而人的行为中最接近这种幸福的东西，也许是与思考最密切的活动。",
        "美是一种善，其所以引起快感，正因为它善。",
        "“实践理智的真理要和正确的欲望相一致”。",
        "我们因行使正义而得公正，因行为节制而变得温和，因勇敢行动而变得勇敢。",
        "想要快乐就得自给自足。",
        "发脾气是值得赞扬的，如果你能做到：在适当的场合，向正确的对象，在合适的时刻，使用恰当的方式，因为公正的理由而发脾气。",
        "如果恶完全变成不堪忍受的，它也将自灭。",
        "公正不是德性的一个部分,而是整个德性;相反,不公正也不是邪恶的一个部分,而是整个邪恶。",
        "人在达到德性的完备时是一切动物中最出色的动物；但如果他一意孤行。目无法律和正义，他就成为一切禽兽中最恶劣的禽兽。",
        "一只燕子，一日晴天，算不得春景。一时偶尔理性的生活，不能长久，也不能使人快乐。",
        "每一个人在本性上都想求知。",
        "真想解除一国的内忧应该依靠良好的立法，不能依靠偶然的机会。",
        "不知道道德就不能做到道德，知道了道德才能做到道德。",
        "人生最终的价值在于觉醒和思考的,而不只在于生存。",
        "教育必须基于三个原则:中庸、可能和适当。",
        "物质与形式是抽象概念，一个具体的事物包含着两者。",
        "可信的不可能性比不可信的可能性更为可取。",
        "最高贵的便是正义，最好的便是健康，最快乐的便是最满足。",
        "质料因、形式因、动力因和目的因是事物形成的基本要素。",
        "贤哲追求的不是享乐，而是源于痛苦的自由。",
        "知识与非知识的区分标准是能否传授，前者能传授而后者不能。",
        "一个人的尊严并非在获得荣誉时，百在于本身真正值得这荣誉。",
        "对于美德，我们仅止于认识是不够的，我们还必须努力培养它，运用它，或是采取种种方法，以使我们成为良善之人。",
        "邪恶事件起因于邪恶。",
        "人类由于志趋善良而有所成就，成为最优良的动物，如果不讲礼法，违背正义，他就堕落为最恶劣的动物。",
        "所有天才的头脑无不是与疯狂相连的。那些崇高、卓越的语言是绝对不可能从庸人的口中说出来的,除了那些激动不安的灵魂。",
        "然而幸福是学得而不是靠运气获得的。因为幸福在于灵魂的合德性的活动，并且是一生中的合德性的活动。",
        "人生就是意外和改变。",
        "形式无论如何也比物质更重要，因为形式是可以创造的。",
        "一个有德性的人，往往为他的朋友和国家的利益而采取行动，必要时乃至牺牲自己的生命。他宁愿捐弃世人所争夺的金钱荣誉和一切财物，只求自己的高尚。",
        "真正高宏之人，必能造福于人类。",
        "在所有的感觉中我们认为视觉最好用，它能让我们看清楚事物之间的许多差别。",
        "智慧由普遍知识产生，不从个别知识得来。",
        "政治学并不制造人类，然而它使人类脱离了自然，并驾驭他们。",
        "一个人面对正当之事物，从正当的时机，而且在这种相应条件下感到自信，他就是一个勇敢的人。",
        "生气很容易，任何人都可以生气。但如果要对着正确的人，在正确的时间，以正确的理由和程度，用正确的方法生气，那就太不容易了。",
        "人，在最完美的时候是动物中的佼佼者，但是，当他与法律和正义隔绝以后，他便是动物中最坏的东西。他在动物中就是最不神圣的，最野蛮的。",
        "政治是自由人的联合体，政治所追求的不是“生活”，而且是“优良的生活”，政治所要面对和思考的，是一个共同体的命运和发展规律。",
        "美丽比一封介绍信更具有推荐力。",
        "仲裁人要以衡平法为依据，法官要以法律为准绳。",
        "国家是一个组织精良的社团，在社团的本质上它和其他社团没有差异，而论其规模则应涵盖其他社团，每一个社团都以一种善为目标，那么国家则更应追求最高的善。",
        "我们能够依靠的只是我们的本性，而不是金钱。",
        "公正是赏罚公明者的美德。",
        "只有在我们认识了根本原因，最初本原而且直到构成元素时，我们才认为是认识了每一事物。",
        "教育是老年生活最好的保障。",
        "他们为求知而从事学术，并无任何实用的目的,我们不为任何其他利益而找寻智慧，只因人本自由。",
        "我们假定，真正的善良明智之人拥有所有的运气，他们总是在做当时条件下做最为高贵的事情，利用自己的力量将好的变为更好。",
        "慷慨是挥霍与吝啬之间的中庸 ,庄重是自傲与顺从之间的中庸 ,谦谨是无耻与羞怯之间的中庸 ,文雅是滑稽与呆板之间的中庸 ,高尚是卑屈和顽强之间的中庸 ,娇柔是坚韧态之间的中庸。",
        "邪恶将人聚于一处。",
        "使人高贵的诸种理论虽然似乎有力量使那些生性高尚的人归于德性，但它们却没有能力去促使大多数人追求善和美。使用理论来改变在性格上形成的习惯，是不可能的，或困难的。",
        "比喻是天才的标志。",
        "在教育上，实践必先于理论，而身体的训练须在智力训练之先。",
        "人类是天生社会性的动物。",
        "没有人会选择孤立状况的整个世界，因为人是政治生物，他的本性要求与他一起生活。",
        "总以某种固定方式行事，人便能养成习惯。",
        "卓越的人在每一个事情上都判断正确，并且每一次真的东西都对他显现。卓越的人格外出众是因为他们在每一个事情上都能看到真的东西，他自身就是标准与尺度的存在。",
        "如果是一个暴君,我们还能推翻它,如果遍地都是暴民,我们能怎么办呢。",
        "优秀的会成为永恒的。",
        "诗是一种比历史更富哲学性，更严肃的艺术。",
        "我们认为我们完全理解了一个事物，只有在我们认为知道了该事物赖以生存的原因的时候，而且，只有这一原因才使该事物存在，否则就是不可能的。",
        "思维自疑问和惊奇开始。",
        "明智的人是善于思考的人。明智是关乎人事的善与恶的符合实践的理性。",
        "离群索居者，不是野兽便是神灵。我希望你能成为神一样的人，而不是如困兽般桎梏。",
        "恐惧是心起恶念时滋生的痛苦。",
        "心智的暴力，可以不流血即取人命。",
        "贫穷是革命与罪孽之母。",
        "“突转”指的是按照可然率或必然率的原则，行动的方向发生变化，转向与预期相反的方向。",
        "交朋友容易,不过友谊本身是个成熟缓慢的水果。",
        "手足不和可谓残忍。",
        "没有一个人能全面把握真理。",
        "最好的生活是沉思，次好的是为了他人付出的荣誉。",
        "避免妒忌的最佳方法是做到名副其实。",
        "口头文字是心理经验的象征，书面文字是口头文字的象征。",
        "品德高尚的人恨，因为一个伟大的心灵的标志,并不是牢记自己所受的屈辱，而是忘记它们。",
        "悲剧来揭示生活中的罪恶、完整,有一定长度的行动的摹仿,它的媒介是语言，具有各种悦耳之音。",
        "最初偏离真理毫厘，到头来就会谬之千里。",
        "因为肯定一切都是真理，等于肯定对立面的肯定，其结果等于肯定我们自己的论点是谬误（因为对立面的肯定不容我们的论点是真理）。但，假如说一切都是谬误，这种肯是谬误了。假如宣称只有我们的肯定才不是谬误，那么我们就不得不接受无数真或假的判定断。因为谁提出真的肯定等于同时宣布肯定就是真理，照此类推，以至无穷。",
        "青年希望表现自己的优越性，在荣誉和金钱之间，更喜欢前者，因为他们还没有感觉到对金钱的需要。",
        "人在本质上是个语言存在物。",
        "心怀嫉妒的人,不但要承受自己的失败和挫折，同时还承担着别人的成功，所以他总是以沮丧的情绪示人。",
        "用自己的双脚丈量土地，将未知变为知识",
        "只要不失去你的崇高，整个世界都会向你敞开",
        "没有一个冬天无法逾越，没有一个春天不会来临",
        "年年今日，灯明如昼，原火不灭，愿人依旧",
        "弱小与无知不是生存的障碍，傲慢才是​",
        "鸡蛋因温暖而破壳而出，因热烈而芳香四溢",
        "尘寰中消长数应当，何必枉悲伤？",
        "日记是一种多么奇怪的东西，你省略不写的，远比你放进去的更重要。",
        "无论我到哪里，外部世界都会随我而动，我的一切遗憾都烟消云散。",
        "我要是两个人就好了，一个说话另一个听，一个生活另一个看。我多么知道爱自己，我谁都不羡慕。",
        "个人不是生下来就是女人，她是变成女人的。",
        "一种徒有其表却无抱负和热情的平庸，一种周而复始重复着的漫无目的的日子，一种渐渐走向死亡却不问及其目的的生命――这就是他们所谓的“幸福”。",
        "需要很多力量，很多傲气，或者很多爱，才能相信人的行动是有价值的，相信生命胜过死亡。",
        "整个现代社会建立一个单一的原则之上————把欲望增加到让人无法忍耐的同时把满足欲望的可能变得越来越渺茫。",
        "每天都有新的选择。",
        "我们对某个地方的怀旧只不过是我们曾经在那里生活过，至于那时我们过得是好还是不好到不重要。过去永远是美好的，正因为如此，过去就是未来。所以，当下让我们受到伤害，当下是同我们皮肤上的脓肿随时随地和我们在一起，当下是在幸福和平和两个无限之间的陪伴。",
        "要是你会觉得迟早有事会发生，那你就大错了。人生完全是可以又短又空虚。日子一天又一天冷漠地过去，既不留下痕迹也不留下记忆，突然一天一切停止。",
        "现代化或许是一场错误。",
        "凡事不能让人怀着热情去做的事情，都是不值得的事。",
        "一个国家的落后，首先是精英的落后，而精英落后的标志就是嘲笑民众落后。",
        "人类是悬挂在自己编织的意义之网上的动物。",
        "情绪高昂的革命精神过后，随之而来的便是因袭成规的日常琐务，从事圣战的领袖，甚至信仰本身，都会销声匿迹，或者，更具实效的是，变成政治市侩和实用型专家常用行话的一部分。",
        "儒教徒无意于弃绝生命的救赎，因为生命是被肯定的；也无意于摆脱社会现世的救赎，因为社会现世是既有而被接受的。他只想通过自制而谨慎地掌握住此世的种种机运。",
        "一个教师所应当做的，不是去充当学生的精神领袖，不是立场鲜明的信仰灌输，而是尽力做到“知识上的诚实”，去“确定事实、确定逻辑关系和数字关系或文化价值的内在结构”，因为没有对手和不允许辩论的讲台，不是先知和煽动家应呆的地方。",
        "路德式的虔诚使大量基于情感的本能行动与无节制的自发活力未受触动。它缺少导向持续的自我控制的驱动力，因此也缺少导向个人自身生活的任何意义上的有计划规范的驱动力。",
        "我们的时代，是一个理性化、理知化，尤其是将世界之迷魅加以祛除的时代；我们这个时代的宿命，便是一切终极而最崇高的价值，已自公共领域隐，没它们或者遁入神秘生活的超验领域，或者走进了个人之间直接的私人交往的友爱之中。",
        "政治也许是一种可能的艺术。当然，恰恰是因为人们追求不可能之事，可能的才得以可能。",
        "如果你不能从学问中获得陶醉感，那就离学术远一点",
        "从生命本身的性质来理解，它所知道的只有诸神之间无穷尽的斗争。直截了当地说，这意味着对待生活的各种可能的终极态度，是无不相容的，因此它们之间的争斗，也是不会有结论的。",
        "一个长期积弱的落后民族在经济上突然崛起必然隐含一个致命的内在危险，即它将加速暴露落后民族特有的“文化不成熟”或“政治不成熟”，这种经济快速发展与文化和政治难以成熟之间的强烈反差，不但最终将使民族振兴的愿望付诸流水，甚至会造成灾难性的结局。",
        "家父长的权力与儿子的恭顺，基本上需要奠基于一种实际的血缘关系―————虽然通常都是基于这样一种关系上。",
        "“自己”这个东西是看不见的，我们要把自己抛出去，撞上一些别的什么，反弹回来，才会了解什么是“自己”。",
        "服装可能是人类最后一个手工艺文化。",
        "如果一个人单独思考的时间太久，什么愚蠢的事情都可以信以为真。",
        "困难的是摆脱旧思想的束缚，而不是新思想的运用。",
        "市场保持非理性的时间，远比你支撑的时间长",
        "通过连续的通货膨胀，政府可以秘密地、不为人知地剥夺人民的财富，在使多数人贫穷的过程中，却使少数人暴富。",
        "经济学家和政治哲学家们的思想，不论它们在对的时候还是在错的时候，都比一般所设想的要更有力量。的确，世界就是由他们统治着。",
        "长远来看，我们都死了。",
        "那些实干家自以为不受任何学理的影响，却往往是某个已故经济学家的思想之奴隶；而那些权威狂人自以为得天启，其狂想实则源自若干年前的某个三流学者。",
        "以传统的方式失败要比以非传统的方式成功更有利于维护名誉。",
        "人比自己认为的要自由得多。",
        "知识变得越抽象复杂，产生疯癫的危险性就越大。",
        "人类必然会疯癫到这种地步，既不疯癫也只是另一种形式的疯癫。",
        "这个社会正在阉割我们，要求我们正常，即使它是令我们变疯的原因。",
        "让被认为是静止的东西动起来，让被认为是整体的东西碎片化，让被想象为拥有一贯性的东西暴露异质性，没有一个永远不变的本质的秘密，真正的秘密就是没有本质。",
        "权力内化的结果是让行为看似是自发的，而非强迫",
        "在人们看来，残酷的惩罚方式，其野蛮程度不亚于，甚至超过犯罪本身，它使观众习惯于本来想让他们厌恶的暴行。它经常地向他们展示犯罪，使刽子手变得像罪犯，使法官变得像谋杀犯，从而在最后一刻调换了各种角色，使受刑的罪犯变成怜悯或赞颂的对象。",
        "这个世界有多少种性格、野心和必然产生的幻觉，不可穷尽的疯癫就有多少种面孔。",
        "当前的目标并不在于发现我们是谁，而是拒绝我们是谁。",
        "变态是符合人性却背离理性的行为。",
        "自从人类堕落以后，人类就把劳动视为一种苦修，指望它具有赎罪的力量。",
        "灵魂是身体的监狱。",
        "公开处决具有危险性，它为国王暴力与民众暴力之间的较量提供了一个舞台。",
        "我们头脑的错乱是我们盲目屈从我们的欲望、我们不能控制和平息我们感情的结果。",
        "疯癫不是一种自然现象，而是一种文明产物。没有把这种现象说成疯癫并加以迫害的各种文化的历史，就不会有疯癫的历史。",
        "心理学作为一种治疗手段从此以惩罚为中心来建构。它首先不是解脱病人，而是按照严厉的道德要求制造痛苦。",
        "疾病的本质不只是存在于它挖出的空洞中，也存在于用来填满这个空洞的替代活动的积极完满中。",
        "人的灵魂的历史现实是：生于被束缚与被监视。",
        "况且，死去的总是别人。",
        "艺术家的状态比他的艺术更为重要。",
        "凡是被禁止的都是令人兴奋的。",
        "罪恶那种缺少美德的优雅，难道不是更加崇高？不是拥有坦白、崇高的品质，那就胜过了美德之单调、柔软之魅力，所以罪恶始终比美德可取。",
        "真正的残酷来自事物本身，是生活的本质使人恐惧。",
        "自然不在乎被叫做“邪恶”的个体，它用仁爱的目光看待战争、迫害与专制。自然没有财产，因此偷盗不是犯罪。在谋杀和自然死亡之间也没有任何区别，只是生命的分子重新组合而已。",
        "我是在我不存在时思考，故我存在于我不进行思考之时。",
        "我思于我不在之处，故我身在我不思之处。",
        "我不是诗人，我是诗。",
        "主体的言说并非主体在“说”，而是语言在使他“说”，是语言在“说”他。",
        "作为受语言制约的一种动物的一个特征，人的欲望就是大他者的欲望。",
        "没有僭越，就无法通向原乐。",
        "我只能从一点去看，但我的存在中，我却在四面八方中被看。",
        "对物的这种命名或象征化不仅是对“物的谋杀”，是物的“无用化”和能指化，而且也是对主体的谋杀，也是主体之欲望的永久放逐。",
        "其实人跟树是一样的，越是向往高处的阳光，它的根就越要伸向黑暗的地底。",
        "世界弥漫着焦躁不安的气息，因为每一个人都急于从自己的枷锁中解放出来。",
        "这世界没有真相，只有视角。",
        "不能听命于自己者，就要受命于他人。",
        "只有不断引起疼痛的东西，才不会忘记。疼痛是本能，是维持记忆力最强有力的手段。",
        "我们的眼睛就是我们的监狱，而目光所及之处就是监狱的围墙。",
        "许多真理都是以笑话的形式讲出来。",
        "生活必须是永无止境的假期。",
      ];

document.addEventListener('DOMContentLoaded', () => {
  const mottoEl = document.getElementById('motto');
  if (mottoEl) {
    mottoEl.innerText = mottos[Math.floor(Math.random() * mottos.length)];
  }
});
