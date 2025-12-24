import type { HttpContext } from '@adonisjs/core/http'
import { IpRateLimiter } from '#services/ip_rate_limiter'

const SUCCESS_MESSAGE = 'Your message has been submitted. Thank you.'

export default class IndexController {
  public async renderHome({ view, request }: HttpContext) {
    const successMessage = request.qs().success ? SUCCESS_MESSAGE : null
    return view.render('pages/home', { successMessage })
  }

  public async contact({ request, response, view }: HttpContext) {
    const ip = request.ip()
    const { name, email, message } = request.only(['name', 'email', 'message'])

    const rateLimiter = IpRateLimiter.getInstance()

    // Check if IP can submit (and add to list if allowed)
    const canSubmit = rateLimiter.canSubmit(ip)

    if (canSubmit) {
      // Process the form submission
      console.log('Contact Form Submission:', { ip, name, email, message })
      // TODO: Add your actual form processing logic here (email sending, database save, etc.)
    } else {
      // Silent rejection - user doesn't know they were rate limited
      console.log('Rate limited submission from IP:', ip)
    }

    // Always return success message regardless of whether form was processed
    response.redirect().withQs({ success: true }).toRoute('/')
  }
}
