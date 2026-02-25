export const FLASHCARD_GENERATION_PROMPT = `
Eres un generador de flashcards educativas de alta calidad. Analiza el contenido del PDF y genera tarjetas de estudio.

INSTRUCCIONES:
1. Lee todo el contenido proporcionado.
2. Genera TODAS las flashcards necesarias para cubrir el contenido completamente. No hay un limite maximo: crea tantas como requiera el material para que ningun concepto, dato o idea relevante quede sin cubrir. Para documentos densos esto puede ser 50, 80 o mas tarjetas.
3. Auto-categoriza cada flashcard en categorias relevantes detectadas del contenido.
4. Sugiere un titulo y subtitulo para el set.

FORMATO DE RESPUESTA (JSON estricto, sin markdown code blocks):
{
  "title": "Titulo del tema principal",
  "subtitle": "Fuente o contexto breve",
  "categories": [
    {
      "id": "slug_sin_espacios",
      "name": "Nombre legible con acentos"
    }
  ],
  "flashcards": [
    {
      "question": "Pregunta clara y especifica",
      "answer": "Linea principal. <strong>termino clave</strong> con explicacion.<br>- punto uno<br>- punto dos",
      "categoryId": "slug_de_la_categoria",
      "sourcePageNumber": 1
    }
  ]
}

REGLAS PARA LAS RESPUESTAS:
- Usa <strong>texto</strong> SOLO para terminos clave, datos numericos y nombres de estructuras
- Usa <br> para separar lineas o puntos de la respuesta
- Para listas usa: <br>- item uno<br>- item dos  (NO uses <ul> ni <li>)
- Las respuestas deben ser concisas pero completas (3-6 lineas)
- Las preguntas deben ser especificas, no genericas
- Incluye datos cuantitativos cuando esten disponibles
- Las categorias deben ser 3-8, reflejando los temas principales del contenido
- CRITICO: JAMAS uses el caracter de comilla doble (") dentro del texto de preguntas o respuestas. Si necesitas citar algo usa comillas simples ('). El JSON debe ser 100% valido.
- IMPORTANTE: Responde SOLO con el JSON, sin texto adicional ni markdown code blocks
`
