# Genera i18n-en.js / i18n-pt.js / i18n-fr.js / i18n-zh.js
# Tupla: (es, en, pt, fr, zh). Si una traducción == español, no se emite esa clave.
import json, re, html, io

T = [
("Libros Digitales Personalizados para Niños | Libros Mágicos by TraccionWeb","Personalized Digital Books for Kids | Magical Books by TraccionWeb","Livros Digitais Personalizados para Crianças | Livros Mágicos by TraccionWeb","Livres Numériques Personnalisés pour Enfants | Livres Magiques by TraccionWeb","儿童个性化数字图书 | TraccionWeb 魔法书"),
("Compra tu Libro Digital Personalizado | Libros Mágicos","Buy Your Personalized Digital Book | Magical Books","Compre o Seu Livro Digital Personalizado | Livros Mágicos","Achetez Votre Livre Numérique Personnalisé | Livres Magiques","购买您的个性化数字图书 | 魔法书"),
("Servicios","Services","Serviços","Services","服务"),
("Libros","Books","Livros","Livres","图书"),
("Vista Previa","Preview","Pré-visualização","Aperçu","预览"),
("Precios","Prices","Preços","Prix","价格"),
("FAQ","FAQ","FAQ","FAQ","常见问题"),
("Contactar","Contact","Contato","Contact","联系我们"),
("Contactar por WhatsApp","Contact on WhatsApp","Contato no WhatsApp","Contacter sur WhatsApp","通过 WhatsApp 联系"),
("Historias que enamoran","Stories that enchant","Histórias que encantam","Histoires qui enchantent","让人着迷的故事"),
("Libros digitales personalizados","Personalized digital books","Livros digitais personalizados","Livres numériques personnalisés","个性化数字图书"),
("para los más pequeños","for the little ones","para os pequenos","pour les petits","给小朋友"),
("Creamos historias digitales únicas donde tu hijo/a es el protagonista. Libros personalizados en formato PDF e interactivo con su nombre y aventuras mágicas.","We create unique digital stories where your child is the protagonist. Personalized books in PDF and interactive format with their name and magical adventures.","Criamos histórias digitais únicas onde o seu filho/a é o protagonista. Livros personalizados em formato PDF e interativo com o seu nome e aventuras mágicas.","Nous créons des histoires numériques uniques où votre enfant est le protagoniste. Des livres personnalisés en format PDF et interactif avec son nom et des aventures magiques.","我们创作独特的数字故事，让孩子成为主角。包含孩子名字和魔法冒险的 PDF 及互动格式个性化图书。"),
("Descarga instantánea mundial.","Instant download worldwide.","Download instantâneo mundial.","Téléchargement instantané dans le monde entier.","全球即时下载。"),
("Ver Libros","View Books","Ver Livros","Voir les livres","查看图书"),
("Ver Precios","View Prices","Ver Preços","Voir les prix","查看价格"),
("Libros descargados","Books downloaded","Livros baixados","Livres téléchargés","已下载图书"),
("Clientes felices","Happy clients","Clientes felices","Clients satisfaits","满意客户"),
("Países con descargas","Countries with downloads","Países com downloads","Pays avec téléchargements","下载覆盖国家"),
("Calificación promedio","Average rating","Classificação média","Note moyenne","平均评分"),
("Por qué elegirnos","Why choose us","Por que nos escolher","Pourquoi nous choisir","为什么选择我们"),
("Características de Nuestros Libros Digitales","Features of Our Digital Books","Recursos dos Nossos Livros Digitales","Caractéristiques de Nos Livres Numériques","我们数字图书的特色"),
("Libros digitales personalizados de alta calidad para niños de todas las edades. Descarga instantánea.","High-quality personalized digital books for children of all ages. Instant download.","Livros digitais personalizados de alta qualidade para crianças de todas as idades. Download instantâneo.","Des livres numériques personnalisés de haute qualité pour tous les âges. Téléchargement instantané.","适合所有年龄段儿童的高品质个性化数字图书，即时下载。"),
("Historias Únicas","Unique Stories","Histórias Únicas","Histoires Uniques","独特故事"),
("Cada libro es escrito especialmente para tu hijo/a. Nombre, apariencia y aventuras completamente personalizadas.","Each book is written especially for your child. Name, appearance and adventures fully personalized.","Cada livro é escrito especialmente para o seu filho/a. Nome, aparência e aventuras totalmente personalizados.","Chaque livre est écrit spécialement pour votre enfant. Nom, apparence et aventures entièrement personnalisés.","每本书都为您的孩子量身打造。名字、外貌和冒险全部个性化。"),
("Colores Brillantes","Bright Colors","Cores Brilhantes","Couleurs Vives","鲜艳色彩"),
("Ilustraciones vibrantes y llamativas que capturan la atención de los más pequeños y fomentan la imaginación.","Vibrant, eye-catching illustrations that capture children's attention and foster imagination.","Ilustrações vibrantes e chamativas que captam a atenção dos pequenos e estimulam a imaginação.","Des illustrations vibrantes et attrayantes qui captent l'attention des enfants et nourrissent l'imagination.","鲜艳夺目的插画，吸引小朋友的注意力并激发想象力。"),
("Descarga Instantánea","Instant Download","Download Instantâneo","Téléchargement Instantané","即时下载"),
("Recibe tu libro digital en segundos. Formato PDF de alta calidad listo para leer en cualquier dispositivo.","Receive your digital book in seconds. High-quality PDF ready to read on any device.","Receba o seu livro digital em segundos. Formato PDF de alta qualidade pronto para ler em qualquer dispositivo.","Recevez votre livre numérique en quelques secondes. PDF de haute qualité prêt à lire sur tous vos appareils.","几秒内收到您的数字图书。高质量 PDF，可在任何设备上阅读。"),
("Regalo Perfecto","Perfect Gift","Presente Perfeito","Cadeau Parfait","完美礼物"),
("El regalo más especial para cumpleaños, Navidad o cualquier ocasión. Sorprende a los peques.","The most special gift for birthdays, Christmas or any occasion. Surprise the kids.","O presente mais especial para aniversários, Natal ou qualquer ocasião. Surpreenda os pequenos.","Le cadeau le plus spécial pour un anniversaire, Noël ou toute occasion. Surprenez les enfants.","生日、圣诞节或任何场合的最特别礼物，给孩子们一个惊喜。"),
("Multi-Dispositivo","Multi-Device","Multi-Dispositivo","Multi-Appareil","多设备"),
("Lee en tablet, celular, computadora o imprime en casa. Compatible con todos los dispositivos del mundo.","Read on tablet, phone, computer or print at home. Compatible with all devices worldwide.","Leia no tablet, celular, computador ou imprima em casa. Compatível com todos os dispositivos do mundo.","Lisez sur tablette, téléphone, ordinateur ou imprimez chez vous. Compatible avec tous les appareils.","可在平板、手机、电脑上阅读或在家打印，兼容全球所有设备。"),
("Personalización Total","Total Personalization","Personalização Total","Personnalisation Totale","完全个性化"),
("Elige nombre, color de pelo, ojos, ropa y hasta el tipo de aventura que quieras para tu hijo/a.","Choose name, hair color, eyes, clothes and even the type of adventure for your child.","Escolha o nome, cor do cabelo, olhos, roupa e até o tipo de aventura para o seu filho/a.","Choisissez le nom, la couleur des cheveux, les yeux, les vêtements et même le type d'aventure pour votre enfant.","选择名字、发色、眼睛、服装，甚至冒险类型。"),
("Nuestros Libros","Our Books","Nossos Livros","Nos Livres","我们的图书"),
("Colección de Libros Personalizados","Collection of Personalized Books","Coleção de Livros Personalizados","Collection de Livres Personnalisés","个性化图书系列"),
("Cada libro es una aventura única. Elige la que más le guste a tu hijo/a y personalízala.","Each book is a unique adventure. Pick your child's favorite and personalize it.","Cada livro é uma aventura única. Escolha a que o seu filho/a mais gosta e personalize-a.","Chaque livre est une aventure unique. Choisissez celle que votre enfant préfère et personnalisez-la.","每本书都是独一无二的冒险。选择孩子最喜欢的并个性化定制。"),
("24 páginas","24 pages","24 páginas","24 pages","24页"),
("28 páginas","28 pages","28 páginas","28 pages","28页"),
("16 páginas","16 pages","16 páginas","16 pages","16页"),
("Tu niño/a es el protagonista de su propia aventura de superhéroe. Incluye su nombre, apariencia y poderes especiales.","Your child is the protagonist of their own superhero adventure. Includes their name, appearance and special powers.","O seu filho/a é o protagonista da própria aventura de super-herói. Inclui o nome, aparência e poderes especiais.","Votre enfant est le protagoniste de sa propre aventure de super-héros. Son nom, son apparence et ses pouvoirs spéciaux inclus.","您的孩子将成为超级英雄冒险的主角，包含名字、外貌和特殊能力。"),
("Ordenar Ahora","Order Now","Encomendar Agora","Commander Maintenant","立即订购"),
("Una historia mágica donde tu hija es la princesa más valiente del reino. Con dragones, castillos y mucho amor.","A magical story where your daughter is the bravest princess in the kingdom. With dragons, castles and lots of love.","Uma história mágica onde a sua filha é a princesa mais corajosa do reino. Com dragões, castelos e muito amor.","Une histoire magique où votre fille est la princesse la plus courageuse du royaume. Avec des dragons, des châteaux et beaucoup d'amour.","一个魔法故事，您的女儿是王国里最勇敢的公主，有龙、城堡和满满的爱。"),
("Tu hijo/a viaja a la luna y más allá en esta emocionante aventura espacial. Con planetas, cohetes y aliens amigables.","Your child travels to the moon and beyond in this exciting space adventure. With planets, rockets and friendly aliens.","O seu filho viaja à lua e além nesta emocionante aventura espacial. Com planetas, foguetes e alienígenas amigáveis.","Votre enfant voyage vers la lune et au-delà dans cette passionnante aventure spatiale. Avec planètes, fusées et aliens sympathiques.","您的孩子在这激动人心的太空冒险中登上月球甚至更远，有行星、火箭和友好的外星人。"),
("Una aventura en la naturaleza donde tu niño/a hace amigos con todos los animales del bosque mágico.","A nature adventure where your child befriends all the animals of the magic forest.","Uma aventura na natureza onde o seu filho faz amigos com todos os animais da floresta mágica.","Une aventure dans la nature où votre enfant se lie d'amitié avec tous les animaux de la forêt magique.","一场自然冒险，您的孩子与魔法森林里的所有动物成为朋友。"),
("Libro interactivo para los más pequeños. Aprende colores con imágenes brillantes y texturas suaves.","Interactive book for the little ones. Learn colors with bright images and soft textures.","Livro interativo para os pequenos. Aprenda cores com imagens brilhantes e texturas suaves.","Livre interactif pour les petits. Apprenez les couleurs avec des images vives et des textures douces.","给小朋友的互动图书，通过鲜艳的图像和柔和的纹理学习颜色。"),
("Tu niño/a es el chef estrella en esta aventura culinaria. Aprende sobre comida saludable mientras se divierte.","Your child is the star chef in this culinary adventure. Learn about healthy food while having fun.","O seu filho é o chef estrela nesta aventura culinária. Aprenda sobre comida saudável enquanto se diverte.","Votre enfant est le chef star de cette aventure culinaire. Découvrez une alimentation saine tout en s'amusant.","您的孩子是这场美食冒险的明星大厨，在玩乐中学习健康饮食。"),
("Mira Cómo Se Ve Tu Libro","See What Your Book Looks Like","Veja Como Fica o Seu Livro","Voir à Quoi Ressemble Votre Livre","看看您的书长什么样"),
("Explora las páginas de nuestro libro \"Mi Super Aventura\" y descubre la calidad de nuestras ilustraciones y contenido personalizado.","Explore the pages of our book \"Mi Super Aventura\" and discover the quality of our illustrations and personalized content.","Explore as páginas do nosso livro \"Mi Super Aventura\" e descubra a qualidade das nossas ilustrações e conteúdo personalizado.","Explorez les pages de notre livre \"Mi Super Aventura\" et découvrez la qualité de nos illustrations et de notre contenu personnalisé.","浏览我们《Mi Super Aventura》的页面，了解插画和个性化内容的高品质。"),
("Portada","Cover","Capa","Couverture","封面"),
("Contraportada","Back Cover","Contra-capa","Quatrième de couverture","封底"),
("Páginas 1-2","Pages 1-2","Páginas 1-2","Pages 1-2","第1-2页"),
("Páginas 3-4","Pages 3-4","Páginas 3-4","Pages 3-4","第3-4页"),
("Páginas 5-6","Pages 5-6","Páginas 5-6","Pages 5-6","第5-6页"),
("Páginas 7-8","Pages 7-8","Páginas 7-8","Pages 7-8","第7-8页"),
("Capítulo 1","Chapter 1","Capítulo 1","Chapitre 1","第一章"),
("Capítulo 2","Chapter 2","Capítulo 2","Chapitre 2","第二章"),
("Capítulo 3","Chapter 3","Capítulo 3","Chapitre 3","第三章"),
("El Despertar Mágico","The Magical Awakening","O Despertar Mágico","Le Réveil Magique","神奇的觉醒"),
("Un día muy especial,","One very special day,","Um dia muito especial,","Un jour très spécial,","特别的一天，"),
("[Nombre del Niño]","[Child's Name]","[Nome da Criança]","[Nom de l'Enfant]","[孩子的名字]"),
("se despertó y descubrió que algo increíble había sucedido durante la noche.","woke up and discovered that something incredible had happened during the night.","acordou e descobriu que algo incrível tinha acontecido durante a noite.","s'est réveillé(e) et a découvert que quelque chose d'incroyable s'était produit durant la nuit.","醒来发现夜里发生了不可思议的事情。"),
("Las estrellas del cielo habían bajado hasta su habitación y le habían regalado unos","The stars in the sky had come down to his room and given him some","As estrelas do céu tinham descido até ao seu quarto e tinham-lhe oferecido uns","Les étoiles du cielo étaient descendues dans sa chambre et lui avaient offert des","天上的星星来到他的房间，送给他一些"),
("superpoderes mágicos","magical superpowers","superpoderes mágicos","super-pouvoirs magiques","魔法超能力"),
("que solo los niños más valientes pueden recibir.","that only the bravest children can receive.","que só as crianças mais corajosas podem receber.","que seuls les enfants les plus courageux peuvent recevoir.","只有最勇敢的孩子才能获得。"),
("\"¡Puedo volar!\" — exclamó","\"I can fly!\" he exclaimed","\"Eu posso voar!\" — exclamou","« Je peux voler ! » s'exclama","“我会飞！”——他喊道"),
("[Nombre]","[Name]","[Nome]","[Nom]","[名字]"),
("mientras se elevaba lentamente sobre su cama, rodeado de destellos dorados y plateados.","as he rose slowly above his bed, surrounded by golden and silver sparkles.","enquanto subia lentamente sobre a sua cama, rodeado de brilhos dourados e prateados.","alors qu'il s'élevait lentement au-dessus de son lit, entouré d'étincelles dorées et argentées.","他缓缓升到床上方，周围环绕着金银闪光。"),
("La Ciudad Arcoíris","Rainbow City","A Cidade Arco-Íris","La Cité Arc-en-Ciel","彩虹之城"),
("voló por encima de las nubes y llegó a una ciudad mágica donde todos los edificios brillaban con los colores del arcoíris.","he flew above the clouds and reached a magical city where all the buildings shone with rainbow colors.","voou por cima das nuvens e chegou a uma cidade mágica onde todos os edifícios brilhavam com as cores do arco-íris.","il vola au-dessus des nuages et arriva dans une ville magique où tous les bâtiments brillaient aux couleurs de l'arc-en-ciel.","他飞越云层，来到一座魔法城市，所有建筑都闪耀着彩虹的颜色。"),
("Los pájaros cantaban su nombre y las mariposas le guiaban por calles llenas de flores luminosas. Cada paso que daba dejaba una estela de estrellas doradas.","Birds sang his name and butterflies guided him through streets full of glowing flowers. Every step left a trail of golden stars.","Os pájaros cantavam o seu nome e as borboletas guiavam-no por ruas cheias de flores luminosas. Cada passo deixava um rastro de estrelas douradas.","Les oiseaux chantaient son nom et les papillons le guidaient dans des rues pleines de fleurs lumineuses. Chaque pas laissait une traînée d'étoiles dorées.","鸟儿唱着他的名字，蝴蝶引着他穿过开满发光花朵的街道。每一步都留下一道金色星星的轨迹。"),
("\"¡Esta es la aventura más increíble del mundo!\" — pensó mientras saludaba a todos los animales mágicos que encontraba en su camino.","\"This is the most incredible adventure in the world!\" he thought as he waved to all the magical animals he met along the way.","\"Esta é a aventura mais incrível do mundo!\" — pensou enquanto acenava a todos os animais mágicos que encontrava no caminho.","« Quelle aventure la plus incroyable du monde ! » pensa-t-il en saluant tous les animaux magiques qu'il rencontrait.","“这是世界上最不可思议的冒险！”他一边想，一边向路上遇到的所有魔法动物挥手。"),
("El Dragón Amigable","The Friendly Dragon","O Dragão Amigável","Le Dragon Amical","友好的龙"),
("En lo alto de una montaña de caramelo,","At the top of a candy mountain,","No topo de uma montanha de caramelo,","Au sommet d'une montagne de bonbons,","在一座糖果山的山顶，"),
("conoció a un dragón muy simpático llamado Chispa, que respiraba burbujas de jabón en vez de fuego.","he met a very friendly dragon named Chispa, who blew soap bubbles instead of fire.","conheceu um dragão muito simpático chamado Chispa, que emitia bolhas de sabão em vez de fogo.","il rencontra un dragon très sympathique nommé Chispa, qui soufflait des bulles de savon au lieu de feu.","他遇到了一只叫 Chispa 的友好龙，它吐出的是肥皂泡而不是火。"),
("\"¿Quieres ser mi amigo?\" — le preguntó Chispa con una sonrisa enorme. Y así comenzó la amistad más extraordinaria que jamás se haya visto.","\"Do you want to be my friend?\" asked Chispa with a huge smile. And so began the most extraordinary friendship ever seen.","\"Queres ser meu amigo?\" — perguntou Chispa com um sorriso enorme. E assim começou a amizade mais extraordinária que alguma vez se viu.","« Veux-tu être mon ami ? » demanda Chispa avec un immense sourire. Ainsi commença l'amitié la plus extraordinaire qui ait jamais existé.","“你想做我的朋友吗？”Chispa 咧着大嘴问。于是史上最非凡的友谊开始了。"),
("Juntos volaron sobre océanos de limonada y montañas de algodón de azúcar, viviendo aventuras que","Together they flew over lemonade oceans and cotton candy mountains, living adventures that","Juntos voaram sobre oceanos de limonada e montanhas de algodão-doce, vivendo aventuras que","Ensemble, ils survolèrent des océans de limonade et des montagnes de guimauves, vivant des aventures qu'ils","他们一起飞越柠檬海洋和棉花糖山，经历着"),
("nunca olvidaría...","he would never forget...","nunca esqueceria...","n'oublierait jamais...","永远不会忘记的冒险……"),
("Un libro personalizado creado especialmente para","A personalized book created especially for","Um livro personalizado criado especialmente para","Un livre personnalisé créé spécialement pour","专为"),
("Usa las flechas o desliza para pasar las páginas","Use the arrows or swipe to turn the pages","Use as setas ou deslize para passar as páginas","Utilisez les flèches ou faites glisser pour tourner les pages","使用箭头或滑动来翻页"),
("Proceso","Process","Processo","Processus","流程"),
("Cómo Funciona","How It Works","Como Funciona","Comment Ça Marche","运作方式"),
("En 3 pasos simples tienes el libro personalizado perfecto para tu hijo/a.","In 3 simple steps you get the perfect personalized book for your child.","Em 3 passos simples você tem o livro personalizado perfeito para o seu filho/a.","En 3 étapes simples, obtenez le livre personnalisé parfait pour votre enfant.","只需 3 个简单步骤，就能为您的孩子获得完美的个性化图书。"),
("Elige tu libro","Choose your book","Escolha o seu livro","Choisissez votre livre","选择您的书"),
("Selecciona la aventura que más le guste a tu niño/a de nuestra colección de historias mágicas.","Pick the adventure your child will like most from our collection of magic stories.","Selecione a aventura que o seu filho/a mais gosta da nossa coleção de histórias mágicas.","Choisissez l'aventure que votre enfant préfère dans notre collection d'histoires magiques.","从我们的魔法故事集中选择孩子最喜欢的冒险。"),
("Personalízalo","Personalize it","Personalize","Personnalisez-le","个性化定制"),
("Agrega el nombre, apariencia y cualquier detalle especial que quieras incluir.","Add the name, appearance and any special detail you want to include.","Adicione o nome, a aparência e qualquer detalhe especial que queira incluir.","Ajoutez le nom, l'apparence et tout détail spécial que vous souhaitez inclure.","添加名字、外貌以及任何想要包含的特别细节。"),
("Recíbelo en casa","Receive it at home","Receba em casa","Recevez-le chez vous","送货上门"),
("Enviamos el libro a tu puerta en 7-14 días. Listo para leer, disfrutar y regalar.","We ship the book to your door in 7-14 days. Ready to read, enjoy and gift.","Enviamos o livro à sua porta em 7-14 dias. Pronto para ler, aproveitar e presentear.","Nous expédions le livre chez vous en 7-14 jours. Prêt à lire, à profiter et à offrir.","我们在 7-14 天内将书送到您家门口，即可阅读、享受和赠送。"),
("Planes de Libros Personalizados","Personalized Book Plans","Planos de Livros Personalizados","Forfaits de Livres Personnalisés","个性化图书套餐"),
("Regalos especiales a precios accesibles. Elige el plan perfecto para tu familia.","Special gifts at affordable prices. Choose the perfect plan for your family.","Presentes especiais a preços acessíveis. Escolha o plano perfeito para a sua família.","Des cadeaux spéciaux à prix abordable. Choisissez le forfait parfait pour votre famille.","特价优惠礼品，为家人选择完美的套餐。"),
("OFERTA RELÁMPAGO","FLASH SALE","OFERTA RELÂMPAGO","OFFRE FLASH","限时抢购"),
("30% OFF en","30% OFF on","30% OFF em","30% OFF sur","30% OFF "),
("todos los planes","all plans","todos os planos","tous les forfaits","所有套餐"),
("comprando ahora","buying now","a comprar agora","achètent maintenant","正在购买"),
("La oferta termina en:","Offer ends in:","A oferta termina em:","L'offre se termine dans :","优惠倒计时："),
("hrs","hrs","hrs","hrs","时"),
("min","min","min","min","分"),
("seg","sec","seg","s","秒"),
("¡Quiero mi descuento!","I want my discount!","Quero o meu desconto!","Je veux ma remise !","我要我的折扣！"),
("Básico","Basic","Básico","Basique","基础版"),
("Primera Aventura","First Adventure","Primeira Aventure","Première Aventure","首次冒险"),
("Perfecto para conocer nuestros libros digitales personalizados.","Perfect to get to know our personalized digital books.","Perfeito para conhecer os nossos livros digitais personalizados.","Parfait pour découvrir nos livres numériques personnalisés.","适合初次了解我们的个性化数字图书。"),
("por ebook","per ebook","por ebook","par ebook","每本电子书"),
("1 libro digital (24 páginas)","1 digital book (24 pages)","1 livro digital (24 páginas)","1 livre numérique (24 pages)","1 本数字书（24页）"),
("Nombre y apariencia del niño/a","Child's name and appearance","Nome e aparência da criança","Nom et apparence de l'enfant","孩子的名字和外貌"),
("Formato PDF alta calidad","High-quality PDF format","Formato PDF de alta qualidade","Format PDF haute qualité","高质量 PDF 格式"),
("Descarga instantánea","Instant download","Download instantâneo","Téléchargement instantané","即时下载"),
("1 revisión de contenido","1 content review","1 revisão de conteúdo","1 révision de contenu","1 次内容审核"),
("Descargar Ahora","Download Now","Baixar Agora","Télécharger Maintenant","立即下载"),
("Más Popular","Most Popular","Mais Popular","Plus Populaire","最受欢迎"),
("Familiar","Family","Familiar","Famille","家庭版"),
("Paquete Completo","Complete Package","Pacote Completo","Pack Complet","完整套餐"),
("Para familias que quieren más historias digitales.","For families who want more digital stories.","Para famílias que querem mais histórias digitales.","Pour les familles qui veulent plus d'histoires numériques.","适合想要更多数字故事的家庭。"),
("3 ebooks","3 ebooks","3 ebooks","3 ebooks","3 本电子书"),
("5 ebooks","5 ebooks","5 ebooks","5 ebooks","5 本电子书"),
("3 libros digitales (24 pág. c/u)","3 digital books (24 pages each)","3 livros digitais (24 pág. cada)","3 livres numériques (24 pages chacun)","3 本数字书（各 24 页）"),
("Nombre y apariencia de cada niño","Name and appearance of each child","Nome e aparência de cada criança","Nom et apparence de chaque enfant","每个孩子的名字和外貌"),
("3 portadas diferentes","3 different covers","3 capas diferentes","3 couvertures différentes","3 个不同封面"),
("Descarga instantánea + imprimible","Instant download + printable","Download instantâneo + imprimível","Téléchargement instantané + imprimable","即时下载 + 可打印"),
("2 revisiones por libro","2 reviews per book","2 revisões por livro","2 révisions par livre","每本书 2 次修订"),
("Versión interactiva con audio","Interactive version with audio","Versão interativa com áudio","Version interactive avec audio","带音频的互动版本"),
("Premium","Premium","Premium","Premium","高级版"),
("Colección Mágica","Magic Collection","Coleção Mágica","Collection Magique","魔法合集"),
("La experiencia digital completa para familias.","The complete digital experience for families.","A experiência digital completa para famílias.","L'expérience numérique complète pour les familles.","为家庭打造的完整数字体验。"),
("5 libros digitales personalizados","5 personalized digital books","5 livros digitais personalizados","5 livres numériques personnalisés","5 本个性化数字书"),
("Personalización completa","Complete personalization","Personalização completa","Personnalisation complète","完全个性化"),
("Formato PDF + interactivo con audio","PDF + interactive with audio","Formato PDF + interativo com áudio","Format PDF + interactif avec audio","PDF + 互动音频版"),
("Descarga instantánea ilimitada","Unlimited instant download","Download instantâneo ilimitado","Téléchargement instantané illimité","无限次即时下载"),
("Revisiones ilimitadas","Unlimited reviews","Revisões ilimitadas","Révisions illimitées","无限次修订"),
("Dedicatoria especial animada","Animated special dedication","Dedicatoria especial animada","Dédicace spéciale animée","动画特别献词"),
("Actualizaciones gratuitas de por vida","Free lifetime updates","Atualizações gratuitas para sempre","Mises à jour gratuites à vie","终身免费更新"),
("Testimonios","Testimonials","Depoimentos","Témoignages","客户评价"),
("Lo Que Dicen Nuestros Clientes","What Our Clients Say","O Que Os Nossos Clientes Dizem","Ce Que Disent Nos Clients","客户怎么说"),
("Miles de familias felices en todo el mundo confían en nosotros.","Thousands of happy families worldwide trust us.","Milhares de famílias felizes em todo o mundo confiam em nós.","Des milliers de familles heureuses dans le monde entier nous font confiance.","全球成千上万的幸福家庭信赖我们。"),
("\"Mi hija se emocionó tanto al ver su nombre en el libro. Lloré de la felicidad. ¡Es el mejor regalo que le he dado!\"","\"My daughter was so excited to see her name in the book. I cried with happiness. It's the best gift I've ever given her!\"","\"A minha filha ficou tão emocionada ao ver o nome dela no livro. Chorei de felicidade. É o melhor presente que já lhe dei!\"","\"Ma fille était si émerveillée de voir son nom dans le livre. J'ai pleuré de joie. C'est le meilleur cadeau que je lui aie fait !\"","“女儿看到书上有她的名字时非常激动，我幸福得哭了。这是我送给她最好的礼物！”"),
("\"La calidad es impresionante. Las ilustraciones son hermosas y mi hijo no para de pedir que le lea su libro cada noche.\"","\"The quality is impressive. The illustrations are beautiful and my son keeps asking me to read his book every night.\"","\"A qualidade é impressionante. As ilustrações são lindas e o meu filho não para de pedir para ler o livro dele todas as noites.\"","\"La qualité est impressionnante. Les illustrations sont magnifiques et mon fils ne cesse de me demander de lui lire son livre chaque soir.\"","“质量令人惊叹。插画非常漂亮，儿子每晚都缠着我读他的书。”"),
("\"Compré 3 libros para mis sobrinos y todos quedaron encantados. El envío fue rápido y el empaque perfecto. 100% recomendado.\"","\"I bought 3 books for my nephews and they all loved them. Shipping was fast and packaging perfect. 100% recommended.\"","\"Comprei 3 livros para os meus sobrinhos e todos adoraram. A entrega foi rápida e a embalagem perfeita. 100% recomendado.\"","\"J'ai acheté 3 livres pour mes neveux et ils ont tous été ravis. Livraison rapide et emballage parfait. 100 % recommandé.\"","“我给侄子们买了 3 本书，他们都很喜欢。发货快，包装完美。100% 推荐。”"),
("\"Pedí un libro desde Venezuela y llegó perfecto. Mi niña se siente como una princesa real. ¡Gracias por hacer esto posible!\"","\"I ordered a book from Venezuela and it arrived perfectly. My girl feels like a real princess. Thank you for making this possible!\"","\"Pedi um livro a partir da Venezuela e chegou perfeito. A minha menina sente-se uma princesa real. Obrigado por tornar isso possível!\"","\"J'ai commandé un livre depuis le Venezuela et il est arrivé parfaitement. Ma fille se sent comme une vraie princesse. Merci de rendre cela possible !\"","“我从委内瑞拉下了单，书完美送达。女儿感觉自己像真正的公主。谢谢你们让这一切成为可能！”"),
("Preguntas Frecuentes","Frequently Asked Questions","Perguntas Frequentes","Questions Fréquentes","常见问题"),
("Todo Lo Que Necesitas Saber","Everything You Need to Know","Tudo o Que Precisa Saber","Tout Ce Que Vous Devez Savoir","您需要知道的一切"),
("Respuestas a las preguntas más comunes sobre nuestros libros digitales personalizados para niños.","Answers to the most common questions about our personalized digital books for children.","Respostas às perguntas mais comuns sobre os nossos livros digitais personalizados para crianças.","Réponses aux questions les plus fréquentes sur nos livres numériques personnalisés pour enfants.","关于我们儿童个性化数字图书的常见问题解答。"),
("¿Cómo funcionan los libros digitales personalizados?","How do personalized digital books work?","Como funcionam os livros digitais personalizados?","Comment fonctionnent les livres numériques personnalisés ?","个性化数字图书是如何运作的？"),
("Eliges un libro de nuestra colección, personalizas el nombre, apariencia y detalles del niño/a, y nosotros creamos una historia digital única donde tu hijo es el protagonista. Recibes un PDF de alta calidad que puedes descargar instantáneamente y leer en cualquier dispositivo (tablet, celular, computadora) o imprimir en casa.","You choose a book from our collection, customize the name, appearance and details of the child, and we create a unique digital story where your child is the protagonist. You receive a high-quality PDF that you can download instantly and read on any device (tablet, phone, computer) or print at home.","Você escolhe um livro da nossa coleção, personaliza o nome, aparência e detalhes da criança, e nós criamos uma história digital única onde o seu filho é o protagonista. Você recebe um PDF de alta qualidade que pode baixar instantaneamente e ler em qualquer dispositivo (tablet, celular, computador) ou imprimir em casa.","Vous choisissez un livre dans notre collection, personnalisez le nom, l'apparence et les détails de l'enfant, et nous créons une histoire numérique unique où votre enfant est le protagoniste. Vous recevez un PDF de haute qualité à télécharger instantanément et à lire sur n'importe quel appareil (tablette, téléphone, ordinateur) ou à imprimer chez vous.","您从我们的收藏中选择一本书，自定义孩子的名字、外貌和细节，我们就会创作一个以您的孩子为主角的独特数字故事。您将收到一个高质量 PDF，可即时下载，在任何设备（平板、手机、电脑）上阅读，或在家打印。"),
("¿En qué formato recibo el libro digital?","In what format do I receive the digital book?","Em que formato recebo o livro digital?","Sous quel format je reçois le livre numérique ?","我以什么格式收到数字图书？"),
("Nuestros libros digitales están disponibles en formato PDF de alta resolución, compatible con todos los dispositivos. Los planes Familiar y Premium también incluyen una versión interactiva con audio narrado. Puedes leerlos en tablet, celular, computadora, o imprimirlos en casa con calidad profesional.","Our digital books are available in high-resolution PDF format, compatible with all devices. The Family and Premium plans also include an interactive version with narrated audio. You can read them on tablet, phone, computer, or print them at home with professional quality.","Os nossos livros digitais estão disponíveis em formato PDF de alta resolução, compatível com todos os dispositivos. Os planos Familiar e Premium também incluem uma versão interativa com áudio narrado. Pode lê-los no tablet, celular, computador ou imprimir em casa com qualidade profissional.","Nos livres numériques sont disponibles en format PDF haute résolution, compatible avec tous les appareils. Les forfaits Famille et Premium incluent aussi une version interactive avec audio narré. Vous pouvez les lire sur tablette, téléphone, ordinateur ou les imprimer chez vous en qualité professionnelle.","我们的数字图书采用高分辨率 PDF 格式，兼容所有设备。家庭版和高级版还包含带旁白音频的互动版本。您可以在平板、手机、电脑上阅读，或以专业质量在家打印。"),
("¿Cuánto tarda en llegar mi libro digital?","How long does my digital book take to arrive?","Quanto tempo demora a chegar o meu livro digital?","Combien de temps faut-il pour recevoir mon livre numérique ?","我的数字图书多久能收到？"),
("¡Es instantáneo! Una vez que completamos la personalización de tu libro (generalmente en 24-48 horas), recibes un enlace de descarga directa. Sin esperas de envío, sin costos de transporte. Lo descargas y lo disfrutas al instante desde cualquier parte del mundo.","It's instant! Once we complete the customization of your book (usually within 24-48 hours), you receive a direct download link. No shipping waits, no transport costs. Download it and enjoy it instantly from anywhere in the world.","É instantâneo! Assim que concluímos a personalização do seu livro (geralmente em 24-48 horas), você recebe um link de download direto. Sem esperas de envio, sem custos de transporte. Baixe e desfrute na hora de qualquer parte do mundo.","C'est instantané ! Dès que la personnalisation de votre livre est terminée (généralement en 24 à 48 heures), vous recevez un lien de téléchargement direct. Sans délai d'expédition, sans frais de transport. Téléchargez et profitez-en instantanément depuis n'importe où dans le monde.","即时送达！完成图书个性化后（通常 24-48 小时内），您会收到直接下载链接。无需等待送货，没有运费。随时随地立即下载享用。"),
("¿Puedo imprimir el libro digital en casa?","Can I print the digital book at home?","Posso imprimir o livro digital em casa?","Puis-je imprimer le livre numérique chez moi ?","我可以在家打印数字图书吗？"),
("¡Sí! Nuestros libros digitales están diseñados en alta resolución para que puedas imprimirlos en casa o en cualquier imprenta con calidad profesional. El PDF incluye guías de corte y maquetación optimizada para impresión.","Yes! Our digital books are designed in high resolution so you can print them at home or at any print shop with professional quality. The PDF includes cutting guides and layout optimized for printing.","Sim! Os nossos livros digitais são projetados em alta resolução para que você possa imprimi-los em casa ou em qualquer gráfica com qualidade profissional. O PDF inclui guias de corte e layout otimizado para impressão.","Oui ! Nos livres numériques sont conçus en haute résolution pour pouvoir les imprimer chez vous ou dans n'importe quelle imprimerie avec une qualité professionnelle. Le PDF inclut des repères de coupe et une mise en page optimisée pour l'impression.","可以！我们的数字图书采用高分辨率设计，您可以在家或任何印刷店以专业质量打印。PDF 包含裁切标记和为打印优化的排版。"),
("¿Qué edades son recomendadas para estos libros?","What ages are these books recommended for?","Que idades são recomendadas para estes livros?","Quels âges sont recommandés pour ces livres ?","这些书适合什么年龄段？"),
("Tenemos libros para todas las edades: desde 0-3 años (Mi Primer Libro de Colores), 3-6 años (El Bosque Encantado, La Receta Mágica, Mi Princesa Favorita), hasta 6-10 años (Mi Super Aventura, Aventura en el Espacio). Cada libro está adaptado al nivel de lectura y comprensión de cada rango de edad.","We have books for all ages: from 0-3 years (Mi Primer Libro de Colores), 3-6 years (El Bosque Encantado, La Receta Mágica, Mi Princesa Favorita), up to 6-10 years (Mi Super Aventura, Aventura en el Espacio). Each book is adapted to the reading and comprehension level of each age range.","Temos livros para todas as idades: dos 0-3 anos (Mi Primer Libro de Colores), 3-6 anos (El Bosque Encantado, La Receta Mágica, Mi Princesa Favorita), até os 6-10 anos (Mi Super Aventura, Aventura en el Espacio). Cada livro está adaptado ao nível de leitura e compreensão de cada faixa etária.","Nous avons des livres pour tous les âges : de 0-3 ans (Mi Primer Libro de Colores), 3-6 ans (El Bosque Encantado, La Receta Mágica, Mi Princesa Favorita), jusqu'à 6-10 ans (Mi Super Aventura, Aventura en el Espacio). Chaque livre est adapté au niveau de lecture et de compréhension de chaque tranche d'âge.","我们有适合所有年龄段的书：0-3 岁（我的第一本颜色书）、3-6 岁（魔法森林、魔法食谱、我最爱的公主），以及 6-10 岁（我的超级冒险、太空冒险）。每本书都根据各年龄段的阅读和理解水平调整。"),
("¿Puedo pedir más de un libro personalizado?","Can I order more than one personalized book?","Posso pedir mais de um livro personalizado?","Puis-je commander plus d'un livre personnalisé ?","我可以订购多本个性化图书吗？"),
("¡Por supuesto! Ofrecemos paquetes familiares de 3 libros por $49.99 y paquetes premium de 5 libros por $79.99 con descuentos especiales, envío express y extras como marcadores personalizados y cajas de regalo.","Of course! We offer family packages of 3 books for $49.99 and premium packages of 5 books for $79.99 with special discounts, express shipping and extras like personalized bookmarks and gift boxes.","Claro! Oferecemos pacotes familiares de 3 livros por $49.99 e pacotes premium de 5 livros por $79.99 com descontos especiais, envio expresso e extras como marcadores personalizados e caixas de presente.","Bien sûr ! Nous proposons des packs familiaux de 3 livres à 49,99 $ et des packs premium de 5 livres à 79,99 $ avec remises spéciales, livraison express et des extras comme des marqueurs personnalisés et des coffrets cadeaux.","当然！我们提供 3 本书的家庭套餐 $49.99 和 5 本书的高级套餐 $79.99，含特别折扣、快递配送以及个性化书签和礼盒等赠品。"),
("¿Listo para crear un libro mágico?","Ready to create a magic book?","Pronto para criar um livro mágico?","Prêt à créer un livre magique ?","准备好创作魔法之书了吗？"),
("Regala a tu hijo/a una historia donde él/ella es la estrella. Envío a todo el mundo.","Gift your child a story where they are the star. Shipping worldwide.","Ofereça ao seu filho/a uma história onde ele/ela é a estrela. Envio para todo o mundo.","Offrez à votre enfant une histoire où il/elle est la vedette. Livraison dans le monde entier.","送给孩子一个由他/她主演的故事。全球配送。"),
("Crear Mi Libro Ahora","Create My Book Now","Criar o Meu Livro Agora","Créer Mon Livre Maintenant","立即创作我的书"),
("Ver Planes y Precios","See Plans and Prices","Ver Planos e Preços","Voir les Forfaits et Prix","查看套餐和价格"),
("Creamos historias únicas y personalizadas donde tu hijo/a es el protagonista. Libros de alta calidad con envío a todo el mundo.","We create unique, personalized stories where your child is the protagonist. High-quality books shipped worldwide.","Criamos histórias únicas e personalizadas onde o seu filho/a é o protagonista. Livros de alta qualidade com envio para todo o mundo.","Nous créons des histoires uniques et personnalisées où votre enfant est le protagoniste. Des livres de haute qualité livrés dans le monde entier.","我们创作以孩子为主角的独特个性化故事。高质量图书，全球配送。"),
("Navegación","Navigation","Navegação","Navigation","导航"),
("Inicio","Home","Início","Accueil","首页"),
("Contacto","Contact","Contato","Contact","联系"),
(". Todos los derechos reservados.",". All rights reserved.",". Todos os direitos reservados.",". Tous droits réservés.","。保留所有权利。"),
("Libros digitales personalizados para niños | Ebooks infantiles | Cuentos digitales personalizados | Descarga instantánea mundial","Personalized digital books for kids | Kids e-books | Personalized digital stories | Instant download worldwide","Livros digitais personalizados para crianças | Ebooks infantis | Histórias digitais personalizadas | Download instantâneo mundial","Livres numériques personnalisés pour enfants | Ebooks pour enfants | Histoires numériques personnalisées | Téléchargement instantané mondial","儿童个性化数字图书 | 儿童电子书 | 个性化数字故事 | 全球即时下载"),
("✓ Verificado","✓ Verified","✓ Verificado","✓ Vérifié","✓ 已验证"),
# ---- comprar.html ----
("Compra Segura","Secure Purchase","Compra Segura","Achat Sécurisé","安全购买"),
("Crea y Pedido Tu Libro Personalizado","Create and Order Your Personalized Book","Crie e Peça o Seu Livro Personalizado","Créez et Commandez Votre Livre Personnalisé","创建并订购您的个性化图书"),
("Selecciona tu plan, elige los libros y completa el formulario con la información de tu niño/a.","Select your plan, choose the books and fill in the form with your child's information.","Selecione o seu plano, escolha os livros e preencha o formulário com as informações da criança.","Choisissez votre forfait, sélectionnez les livres et remplissez le formulaire avec les informations de votre enfant.","选择套餐、挑选图书并填写孩子的信息。"),
("Selecciona tu Plan","Select your Plan","Selecione o Seu Plano","Choisissez Votre Forfait","选择您的套餐"),
("Información del Niño/A","Child's Information","Informação da Criança","Informations sur l'Enfant","孩子的信息"),
("Nombre del Niño","Child's Name","Nome da Criança","Nom de l'Enfant","孩子姓名"),
("Edad","Age","Idade","Âge","年龄"),
("Teléfono / WhatsApp","Phone / WhatsApp","Telefone / WhatsApp","Téléphone / WhatsApp","电话 / WhatsApp"),
("Detalles del Libro","Book Details","Detalhes do Livro","Détails du Livre","图书详情"),
("Título o Tema","Title or Theme","Título ou Tema","Titre ou Thème","标题或主题"),
("Descripción","Description","Descrição","Description","描述"),
("Plan y Precio","Plan and Price","Plano e Preço","Forfait et Prix","套餐与价格"),
("Libros:","Books:","Livros:","Livres :","图书："),
("Selecciona los Libros","Select the Books","Selecione os Livros","Choisissez les Livres","选择图书"),
# ---- Placeholders ----
("Ej: Mateo","e.g. Mateo","ex.: Mateo","ex. : Mateo","例如：马特奥"),
("Ej: 5","e.g. 5","ex.: 5","ex. : 5","例如：5"),
("Ej: Aventura en el Espacio","e.g. Space Adventure","ex.: Aventura no Espaço","ex. : Aventure spatiale","例如：太空冒险"),
("Ej: +57 300 123 4567","e.g. +57 300 123 4567","ex.: +57 300 123 4567","ex. : +57 300 123 4567","例如：+57 300 123 4567"),
("Describe la aventura, poderes, amigos, etc.","Describe the adventure, powers, friends, etc.","Descreva a aventura, poderes, amigos, etc.","Décrivez l'aventure, les pouvoirs, les amis, etc.","描述冒险、能力、朋友等。"),
# ---- Dinámicos / alertas / éxito (script.js) ----
("Procesando...","Processing...","Processando...","Traitement en cours...","处理中..."),
("¡Gracias por tu pedido!","Thank you for your order!","Obrigado pelo seu pedido!","Merci pour votre commande !","感谢您的订购！"),
("Tu pago fue procesado exitosamente.","Your payment was processed successfully.","O seu pagamento foi processado com sucesso.","Votre paiement a été traité avec succès.","您的支付已成功处理。"),
("Pedido:","Order:","Pedido:","Commande :","订单："),
("En recibirás un enlace de descarga en tu correo en los próximos 24-48 horas.","You will receive a download link in your email within the next 24-48 hours.","Você receberá um link de download no seu e-mail nas próximas 24-48 horas.","Vous recevrez un lien de téléchargement par e-mail dans les prochaines 24 à 48 heures.","您将在未来 24-48 小时内收到发送到邮箱的下载链接。"),
("Plan: basico ($9.99)","Plan: Basic ($9.99)","Plano: basico ($9.99)","Forfait : Basique ($9.99)","套餐：基础版（$9.99）"),
("Plan: familiar ($24.99)","Plan: Family ($24.99)","Plano: familiar ($24.99)","Forfait : Famille ($24.99)","套餐：家庭版（$24.99）"),
("Plan: premium ($39.99)","Plan: Premium ($39.99)","Plano: premium ($39.99)","Forfait : Premium ($39.99)","套餐：高级版（$39.99）"),
("Por favor, selecciona un plan primero","Please select a plan first","Por favor, selecione um plano primeiro","Veuillez d'abord choisir un forfait","请先选择套餐"),
("Por favor completa: {fields}","Please complete: {fields}","Por favor, complete: {fields}","Veuillez compléter : {fields}","请填写：{fields}"),
("el nombre del niño/a","the child's name","o nome da criança","le nom de l'enfant","孩子的姓名"),
("la edad","the age","a idade","l'âge","年龄"),
("tu teléfono / WhatsApp","your phone / WhatsApp","o seu telefone / WhatsApp","votre téléphone / WhatsApp","您的电话 / WhatsApp"),
("el título o tema del libro","the book title or theme","o título ou tema do livro","le titre ou le thème du livre","图书标题或主题"),
("Tu plan permite elegir hasta {limit} libro{s}. Cambia de plan o deselecciona uno primero.","Your plan allows up to {limit} book{s}. Change plan or deselect one first.","O seu plano permite até {limit} livro{s}. Mude de plano ou desmarque um primeiro.","Votre forfait autorise {limit} livre{s}. Changez de forfait ou désélectionnez-en un d'abord.","您的套餐最多可选 {limit} 本书。请先更换套餐或取消选择。"),
("Puedes elegir hasta 1 libro de la colección — o cuéntanos tu propia idea abajo.","You can choose up to 1 book from the collection — or tell us your own idea below.","Pode escolher até 1 livro da coleção — ou conte-nos a sua própria ideia abaixo.","Vous pouvez choisir jusqu'à 1 livre de la collection — ou racontez-nous votre propre idée ci-dessous.","您最多可以从合集中选择 1 本书——也可以在下方告诉我们您的想法。"),
("Puedes elegir hasta 3 libros de la colección — o cuéntanos tu propia idea abajo.","You can choose up to 3 books from the collection — or tell us your own idea below.","Pode escolher até 3 livros da coleção — ou conte-nos a sua própria ideia abaixo.","Vous pouvez choisir jusqu'à 3 livres de la collection — ou racontez-nous votre propre idée ci-dessous.","您最多可以从合集中选择 3 本书——也可以在下方告诉我们您的想法。"),
("Puedes elegir hasta 5 libros de la colección — o cuéntanos tu propia idea abajo.","You can choose up to 5 books from the collection — or tell us your own idea below.","Pode escolher até 5 livros da colección — ou conte-nos a sua própria ideia abaixo.","Vous pouvez choisir jusqu'à 5 livres de la collection — ou racontez-nous votre propre idée ci-dessous.","您最多可以从合集中选择 5 本书——也可以在下方告诉我们您的想法。"),
("descargó","downloaded","baixou","a téléchargé","下载了"),
("para","for","para","pour","为"),
# ---- Social proof (12 notificaciones fijas) ----
("🇨🇴 Colombia","🇨🇴 Colombia","🇨🇴 Colombia","🇨🇴 Colombie","🇨🇴 哥伦比亚"),
("🇲🇽 México","🇲🇽 Mexico","🇲🇽 México","🇲🇽 Mexique","🇲🇽 墨西哥"),
("🇪🇸 España","🇪🇸 Spain","🇪🇸 Espanha","🇪🇸 Espagne","🇪🇸 西班牙"),
("🇦🇷 Argentina","🇦🇷 Argentina","🇦🇷 Argentina","🇦🇷 Argentine","🇦🇷 阿根廷"),
("🇻🇪 Venezuela","🇻🇪 Venezuela","🇻🇪 Venezuela","🇻🇪 Venezuela","🇻🇪 委内瑞拉"),
("🇨🇱 Chile","🇨🇱 Chile","🇨🇱 Chile","🇨🇱 Chili","🇨🇱 智利"),
("🇵🇪 Perú","🇵🇪 Peru","🇵🇪 Peru","🇵🇪 Pérou","🇵🇪 秘鲁"),
("🇺🇾 Uruguay","🇺🇾 Uruguay","🇺🇾 Uruguay","🇺🇾 Uruguay","🇺🇾 乌拉圭"),
("🇪🇨 Ecuador","🇪🇨 Ecuador","🇪🇨 Ecuador","🇪🇨 Équateur","🇪🇨 厄瓜多尔"),
("🇩🇴 Rep. Dominicana","🇩🇴 Dominican Rep.","🇩🇴 Rep. Dominicana","🇩🇴 Rép. Dominicaine","🇩🇴 多米尼加"),
("🇵🇦 Panamá","🇵🇦 Panama","🇵🇦 Panamá","🇵🇦 Panama","🇵🇦 巴拿马"),
("🇨🇷 Costa Rica","🇨🇷 Costa Rica","🇨🇷 Costa Rica","🇨🇷 Costa Rica","🇨🇷 哥斯达黎加"),
]

COUNTRIES = {
 "🇨🇴 Colombia": {"en":"🇨🇴 Colombia","pt":"🇨🇴 Colombia","fr":"🇨🇴 Colombie","zh":"🇨🇴 哥伦比亚"},
 "🇲🇽 México": {"en":"🇲🇽 Mexico","pt":"🇲🇽 México","fr":"🇲🇽 Mexique","zh":"🇲🇽 墨西哥"},
 "🇪🇸 España": {"en":"🇪🇸 Spain","pt":"🇪🇸 Espanha","fr":"🇪🇸 Espagne","zh":"🇪🇸 西班牙"},
 "🇦🇷 Argentina": {"en":"🇦🇷 Argentina","pt":"🇦🇷 Argentina","fr":"🇦🇷 Argentine","zh":"🇦🇷 阿根廷"},
 "🇻🇪 Venezuela": {"en":"🇻🇪 Venezuela","pt":"🇻🇪 Venezuela","fr":"🇻🇪 Venezuela","zh":"🇻🇪 委内瑞拉"},
 "🇨🇱 Chile": {"en":"🇨🇱 Chile","pt":"🇨🇱 Chile","fr":"🇨🇱 Chili","zh":"🇨🇱 智利"},
 "🇵🇪 Perú": {"en":"🇵🇪 Peru","pt":"🇵🇪 Peru","fr":"🇵🇪 Pérou","zh":"🇵🇪 秘鲁"},
 "🇺🇾 Uruguay": {"en":"🇺🇾 Uruguay","pt":"🇺🇾 Uruguay","fr":"🇺🇾 Uruguay","zh":"🇺🇾 乌拉圭"},
 "🇪🇨 Ecuador": {"en":"🇪🇨 Ecuador","pt":"🇪🇨 Ecuador","fr":"🇪🇨 Équateur","zh":"🇪🇨 厄瓜多尔"},
 "🇩🇴 Rep. Dominicana": {"en":"🇩🇴 Dominican Rep.","pt":"🇩🇴 Rep. Dominicana","fr":"🇩🇴 Rép. Dominicaine","zh":"🇩🇴 多米尼加"},
 "🇵🇦 Panamá": {"en":"🇵🇦 Panama","pt":"🇵🇦 Panamá","fr":"🇵🇦 Panama","zh":"🇵🇦 巴拿马"},
 "🇨🇷 Costa Rica": {"en":"🇨🇷 Costa Rica","pt":"🇨🇷 Costa Rica","fr":"🇨🇷 Costa Rica","zh":"🇨🇷 哥斯达黎加"},
}
TIMES = [2,5,8,11,14,17,20,23,26,30,33,36]
COUNTRY_ORDER = list(COUNTRIES.keys())

LANGS = ["en","pt","fr","zh"]
d = {l: {} for l in LANGS}

for row in T:
    es = row[0]
    for i, l in enumerate(LANGS):
        val = row[i+1]
        if val != es:
            d[l][es] = val

# Social proof: "Hace N min · 🇨🇴 Colombia"
for idx, t in enumerate(TIMES):
    country = COUNTRY_ORDER[idx]
    flags = country.split(" ", 1)[0]
    cname = country.split(" ", 1)[1]
    for l in LANGS:
        time_tr = {"en": f"{t} min ago", "pt": f"há {t} min", "fr": f"il y a {t} min", "zh": f"{t}分钟前"}[l]
        cpart = COUNTRIES[country][l].split(" ", 1)[1] if " " in COUNTRIES[country][l] else cname
        # keep flag from country translation
        flag_tr = COUNTRIES[country][l].split(" ")[0]
        full = f"{time_tr} · {flag_tr} {cpart}"
        es_full = f"Hace {t} min · {country}"
        if full != es_full:
            d[l][es_full] = full

# Reglas dinámicas
RULES = {
 "en": [
   {"re": "^Pagar con PayPal - \\$([\\d.]+)$", "to": "Pay with PayPal - $1"},
   {"re": "^(\\d+) personas$", "to": "$1 people"},
   {"re": "^Libros: (\\d+)$", "to": "Books: $1"},
   {"re": "^Nombre: (.+)$", "to": "Name: $1"},
   {"re": "^Tel: (.+)$", "to": "Tel: $1"},
   {"re": "^Título: (.+)$", "to": "Title: $1"},
   {"re": "^\\((\\d+) años\\)$", "to": "($1 years)"},
 ],
 "pt": [
   {"re": "^Pagar com PayPal - \\$([\\d.]+)$".replace("com","com"), "to": "Pagar com PayPal - $1"},
   {"re": "^Pagar con PayPal - \\$([\\d.]+)$", "to": "Pagar com PayPal - $1"},
   {"re": "^(\\d+) personas$", "to": "$1 pessoas"},
   {"re": "^Libros: (\\d+)$", "to": "Livros: $1"},
   {"re": "^Nombre: (.+)$", "to": "Nome: $1"},
   {"re": "^Tel: (.+)$", "to": "Tel: $1"},
   {"re": "^Título: (.+)$", "to": "Título: $1"},
   {"re": "^\\((\\d+) años\\)$", "to": "($1 anos)"},
 ],
 "fr": [
   {"re": "^Pagar con PayPal - \\$([\\d.]+)$", "to": "Payer avec PayPal - $1"},
   {"re": "^(\\d+) personas$", "to": "$1 personnes"},
   {"re": "^Libros: (\\d+)$", "to": "Livres : $1"},
   {"re": "^Nombre: (.+)$", "to": "Nom : $1"},
   {"re": "^Tel: (.+)$", "to": "Tél : $1"},
   {"re": "^Título: (.+)$", "to": "Titre : $1"},
   {"re": "^\\((\\d+) años\\)$", "to": "($1 ans)"},
 ],
 "zh": [
   {"re": "^Pagar con PayPal - \\$([\\d.]+)$", "to": "使用 PayPal 支付 - $1"},
   {"re": "^(\\d+) personas$", "to": "$1人"},
   {"re": "^Libros: (\\d+)$", "to": "图书: $1"},
   {"re": "^Nombre: (.+)$", "to": "姓名: $1"},
   {"re": "^Tel: (.+)$", "to": "电话: $1"},
   {"re": "^Título: (.+)$", "to": "标题: $1"},
   {"re": "^\\((\\d+) años\\)$", "to": "（$1岁）"},
 ],
}
# La regla de PayPal pt debe capturar el original en español
RULES["pt"] = [r for r in RULES["pt"] if "Pagar com PayPal - \\\\$([\\\\d.]+)$" not in r["re"] or "con" in r["re"]]

for l in LANGS:
    lines = []
    lines.append("/* Generado automáticamente - no editar a mano */")
    lines.append("(function(){'use strict';")
    lines.append("window.I18N_DICTS = window.I18N_DICTS || {};")
    lines.append("window.I18N_DICTS[%s] = {" % json.dumps(l))
    for k in sorted(d[l].keys()):
        lines.append("%s: %s," % (json.dumps(k, ensure_ascii=False), json.dumps(d[l][k], ensure_ascii=False)))
    rules = RULES[l]
    lines.append("_rules: [")
    for r in rules:
        lines.append("{re: new RegExp(%s, 'i'), to: %s}," % (json.dumps(r["re"]), json.dumps(r["to"], ensure_ascii=False)))
    lines.append("]")
    lines.append("};")
    lines.append("})();")
    with io.open("i18n-%s.js" % l, "w", encoding="utf-8") as f:
        f.write("\n".join(lines) + "\n")
    print("i18n-%s.js: %d claves, %d reglas" % (l, len(d[l]), len(rules)))

# ---- Verificación: qué cadenas de los HTML no tienen clave ni son omitidas ----
SKIP = {"Libros Mágicos","Mi Super Aventura","Mi Princesa Favorita","Aventura en el Espacio",
        "El Bosque Encantado","Mi Primer Libro de Colores","La Receta Mágica","TraccionWeb",
        "WhatsApp","www.traccionweb.com","Powered by TraccionWeb","TraccionWeb.com",
        "MC","JR","AL","CP","10K+","98%","150+","4.9","María C.","José R.","Ana L.",
        "Carlos P.","© 2026 Libros Mágicos by","23 personas","Pagar con PayPal - $0.00",
        "Historias que enamoran"}

def texts(path):
    with open(path, encoding="utf-8") as f:
        c = f.read()
    c = re.sub(r"<script.*?</script>", " ", c, flags=re.S)
    c = re.sub(r"<!--.*?-->", " ", c, flags=re.S)
    c = re.sub(r"<[^>]+>", "\n", c)
    out = []
    for line in c.split("\n"):
        t = html.unescape(line).strip()
        if t and not t.isdigit() and not re.fullmatch(r"[\W\d_]+", t):
            out.append(t)
    seen, uniq = set(), []
    for t in out:
        if t not in seen:
            seen.add(t); uniq.append(t)
    return uniq

missing = []
for path in ("index.html", "comprar.html"):
    for t in texts(path):
        if t in SKIP: continue
        if t in d["en"]: continue
        if any(r["re"] and re.compile(r["re"], re.I).match(t) for r in RULES["en"]): continue
        missing.append((path, t))
print("SIN TRADUCIR:", len(missing))
for p, t in missing:
    print("  ", p, "|", t[:110])
